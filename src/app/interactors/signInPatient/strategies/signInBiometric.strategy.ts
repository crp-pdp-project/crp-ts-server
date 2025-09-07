import { SignInPatientBodyDTO } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { AuthAttemptModel } from 'src/app/entities/models/authAttempt/authAttempt.model';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { ICleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import { ISignInBiometricRepository } from 'src/app/repositories/database/signInBiometric.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { IEncryptionManager } from 'src/general/managers/encryption/encryption.manager';

import { ISignInStrategy } from '../signInPatient.interactor';

export class SignInBiometricStrategy implements ISignInStrategy {
  constructor(
    private readonly signInBiometric: ISignInBiometricRepository,
    private readonly encryptionManager: IEncryptionManager,
    private readonly cleanBlocked: ICleanBlockedRepository,
  ) {}

  async verifySignIn(
    body: SignInPatientBodyDTO,
    attempt: AuthAttemptModel,
    device: DeviceModel,
  ): Promise<PatientModel> {
    const patient = await this.getPatientAccount(body, device);
    await this.validateSignIn(body.password, patient, attempt);

    return patient;
  }

  private async getPatientAccount(body: SignInPatientBodyDTO, device: DeviceModel): Promise<PatientModel> {
    const patient = await this.signInBiometric.execute(
      body.documentType,
      body.documentNumber,
      device.identifier!,
      device.os!,
    );

    return new PatientModel(patient ?? {});
  }

  private async validateSignIn(password: string, patient: PatientModel, attempt: AuthAttemptModel): Promise<void> {
    if (!patient.device?.biometricHash || !patient.device?.biometricSalt) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.BIOMETRIC_NOT_ENROLLED });
    }

    const isValidPassword = await this.encryptionManager.comparePassword(
      password,
      patient.device.biometricHash,
      patient.device.biometricSalt,
    );

    if (isValidPassword) {
      await this.cleanBlocked.execute(attempt.documentNumber);
    } else {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.BIOMETRIC_INVALID });
    }
  }
}
