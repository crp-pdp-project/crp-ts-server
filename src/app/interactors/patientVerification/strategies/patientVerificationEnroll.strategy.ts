import { EnrollSessionPayloadDTO } from 'src/app/entities/dtos/service/enrollSessionPayload.dto';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { ISavePatientRepository } from 'src/app/repositories/database/savePatient.repository';
import { IUpsertDeviceRepository } from 'src/app/repositories/database/upsertDevice.respository';
import { IConfirmPatientRepository } from 'src/app/repositories/soap/confirmPatient.repository';
import { ICreatePatientNHCRepository } from 'src/app/repositories/soap/createPatientNHC.repository';
import { ISearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import { IPatientVerificationStrategy } from '../patientVerification.interactor';

export class PatientVerificationEnrollStrategy implements IPatientVerificationStrategy {
  constructor(
    private readonly confirmPatientRepository: IConfirmPatientRepository,
    private readonly createPatientNHC: ICreatePatientNHCRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly savePatientRepository: ISavePatientRepository,
    private readonly upsertDevice: IUpsertDeviceRepository,
  ) {}

  async generateSession(
    patientExternalModel: PatientExternalModel,
    device: DeviceModel,
  ): Promise<EnrollSessionPayloadDTO> {
    if (patientExternalModel.hasValidAccount()) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.PATIENT_REGISTERED });
    }

    await this.confirmPatientCreation(patientExternalModel);
    await this.validateNHCId(patientExternalModel);
    await this.persistPatient(patientExternalModel);
    await this.registerDevice(patientExternalModel, device);

    return patientExternalModel.toEnrollSession();
  }

  private async confirmPatientCreation(patientExternalModel: PatientExternalModel): Promise<void> {
    const confirmationResult = await this.confirmPatientRepository.execute(patientExternalModel.getRawSearchResult());

    if (confirmationResult.fmpId !== patientExternalModel.fmpId) {
      throw ErrorModel.unprocessable({ detail: ClientErrorMessages.UNPROCESSABLE_PATIENT });
    }
  }

  private async validateNHCId(patientExternalModel: PatientExternalModel): Promise<void> {
    if (!patientExternalModel.nhcId) {
      await this.createPatientNHC.execute(patientExternalModel.fmpId!);
      const updatedSearchResult = await this.searchPatientRepository.execute({ fmpId: patientExternalModel.fmpId });
      patientExternalModel.updateModel(updatedSearchResult).validateCenter();
    }
  }

  private async persistPatient(patientExternalModel: PatientExternalModel): Promise<void> {
    if (!patientExternalModel.hasPersistedPatient()) {
      const { insertId } = await this.savePatientRepository.execute(patientExternalModel.toPersistPatientPayload());
      patientExternalModel.inyectPatientId(Number(insertId));
    }
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
