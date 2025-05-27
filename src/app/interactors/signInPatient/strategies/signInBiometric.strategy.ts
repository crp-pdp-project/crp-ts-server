import {
  SignInBiometricBodyDTO,
  SignInBiometricBodyDTOSchema,
} from 'src/app/entities/dtos/input/signInBiometric.input.dto';
import { AuthAttemptsDTO } from 'src/app/entities/dtos/service/authAttempts.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ISignInBiometricRepository } from 'src/app/repositories/database/signInBiometric.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { IAuthAttemptManager } from 'src/general/managers/authAttempt.manager';
import { IEncryptionManager } from 'src/general/managers/encryption.manager';

import { ISignInStrategy } from '../signInPatient.interactor';

export class SignInBiometricStrategy implements ISignInStrategy {
  constructor(
    private readonly signInBiometric: ISignInBiometricRepository,
    private readonly encryptionManager: IEncryptionManager,
    private readonly authAttemptManager: IAuthAttemptManager,
  ) {}

  async signIn(body: SignInBiometricBodyDTO): Promise<PatientDTO> {
    const validatedBody = this.validateInput(body);
    const attempt = await this.authAttemptManager.validateAttempt(validatedBody.documentNumber);
    const patient = await this.getPatientAccount(validatedBody);
    const { hash, salt } = this.extractAccountPassword(patient);
    await this.validatePassword(validatedBody, hash, salt, attempt);

    return patient;
  }

  private validateInput(body: SignInBiometricBodyDTO): SignInBiometricBodyDTO {
    return SignInBiometricBodyDTOSchema.parse(body);
  }

  private async getPatientAccount(body: SignInBiometricBodyDTO): Promise<PatientDTO> {
    const patient = await this.signInBiometric.execute(body.documentType, body.documentNumber);

    if (!patient) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.BIOMETRIC_NOT_ENROLLED });
    }

    return patient;
  }

  private extractAccountPassword(patient: PatientDTO): { hash: string; salt: string } {
    if (!patient.account?.biometricHash || !patient.account?.biometricSalt) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.BIOMETRIC_NOT_ENROLLED });
    }

    return {
      hash: patient.account.biometricHash,
      salt: patient.account.biometricSalt,
    };
  }

  private async validatePassword(
    body: SignInBiometricBodyDTO,
    hash: string,
    salt: string,
    attempt?: AuthAttemptsDTO,
  ): Promise<void> {
    const isValidPassword = await this.encryptionManager.comparePassword(body.password, hash, salt);

    if (isValidPassword) {
      await this.authAttemptManager.handleSuccess(attempt);
    } else {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.BIOMETRIC_INVALID });
    }
  }
}
