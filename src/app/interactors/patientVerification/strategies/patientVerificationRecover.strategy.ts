import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { IUpsertDeviceRepository } from 'src/app/repositories/database/upsertDevice.respository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import { IPatientVerificationStrategy } from '../patientVerification.interactor';

export class PatientVerificationRecoverStrategy implements IPatientVerificationStrategy {
  constructor(private readonly upsertDevice: IUpsertDeviceRepository) {}

  async generateSession(patientExternalModel: PatientExternalModel, device: DeviceModel): Promise<SessionPayloadDTO> {
    if (!patientExternalModel.hasValidAccount()) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.PATIENT_NOT_REGISTERED });
    }

    await this.registerDevice(patientExternalModel, device);

    return patientExternalModel.toRecoverSession();
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
