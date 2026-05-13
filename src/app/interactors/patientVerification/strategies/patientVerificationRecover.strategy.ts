import type { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import type { DeviceModel } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import type { IUpsertDeviceRepository } from 'src/app/repositories/database/upsertDevice.respository';
import { UpsertDeviceRepository } from 'src/app/repositories/database/upsertDevice.respository';
import type { IUpsertPatientRepository } from 'src/app/repositories/database/upsertPatient.repository';
import { UpsertPatientRepository } from 'src/app/repositories/database/upsertPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import type { IPatientVerificationStrategy } from '../patientVerification.interactor';

export class PatientVerificationRecoverStrategy implements IPatientVerificationStrategy {
  constructor(
    private readonly upsertDevice: IUpsertDeviceRepository,
    private readonly upsertPatientRepository: IUpsertPatientRepository,
  ) {}

  async generateSession(patientExternalModel: PatientExternalModel, device: DeviceModel): Promise<SessionPayloadDTO> {
    if (!patientExternalModel.hasValidAccount()) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.PATIENT_NOT_REGISTERED });
    }

    await this.updatePatient(patientExternalModel);
    await this.registerDevice(patientExternalModel, device);

    return patientExternalModel.toRecoverSession();
  }

  private async updatePatient(patientExternalModel: PatientExternalModel): Promise<void> {
    const { insertId } = await this.upsertPatientRepository.execute(patientExternalModel.toPersistPatientPayload());
    patientExternalModel.inyectPatientId(Number(insertId));
  }

  private async registerDevice(patientExternalModel: PatientExternalModel, device: DeviceModel): Promise<void> {
    const { insertId } = await this.upsertDevice.execute({
      patientId: patientExternalModel.id,
      os: device.os,
      identifier: device.identifier,
      name: device.name,
      expiresAt: device.expiresAt,
    });

    patientExternalModel.inyectNewDevice(Number(insertId));
  }
}

export class PatientVerificationRecoverStrategyBuilder {
  static build(): PatientVerificationRecoverStrategy {
    return new PatientVerificationRecoverStrategy(new UpsertDeviceRepository(), new UpsertPatientRepository());
  }
}
