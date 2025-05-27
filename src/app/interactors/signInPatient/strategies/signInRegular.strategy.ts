import { SignInPatientBodyDTO, SignInPatientBodyDTOSchema } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { AuthAttemptsDTO } from 'src/app/entities/dtos/service/authAttempts.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ISignInPatientRepository } from 'src/app/repositories/database/signInPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { IAuthAttemptManager } from 'src/general/managers/authAttempt.manager';
import { IEncryptionManager } from 'src/general/managers/encryption.manager';

import { ISignInStrategy } from '../signInPatient.interactor';

export class SignInRegularStrategy implements ISignInStrategy {
  constructor(
    private readonly signInPatient: ISignInPatientRepository,
    private readonly encryptionManager: IEncryptionManager,
    private readonly authAttemptManager: IAuthAttemptManager,
  ) {}

  async signIn(body: SignInPatientBodyDTO): Promise<PatientDTO> {
    const validatedBody = this.validateInput(body);
    const attempt = await this.authAttemptManager.validateAttempt(validatedBody.documentNumber);
    const patient = await this.getPatientAccount(validatedBody, attempt);
    const { hash, salt } = this.extractAccountPassword(patient);
    await this.validatePassword(validatedBody, hash, salt, attempt);

    return patient;
  }

  private validateInput(body: SignInPatientBodyDTO): SignInPatientBodyDTO {
    return SignInPatientBodyDTOSchema.parse(body);
  }

  private async getPatientAccount(body: SignInPatientBodyDTO, attempt?: AuthAttemptsDTO): Promise<PatientDTO> {
    const patient = await this.signInPatient.execute(body.documentType, body.documentNumber);

    if (!patient) {
      await this.authAttemptManager.handleFailure(body.documentNumber, attempt);
      throw ErrorModel.unauthorized({ detail: ClientErrorMessages.AUTH_INVALID });
    }

    return patient;
  }

  private extractAccountPassword(patient: PatientDTO): { hash: string; salt: string } {
    if (!patient.account?.passwordHash || !patient.account?.passwordSalt) {
      throw ErrorModel.unauthorized({ detail: ClientErrorMessages.AUTH_INVALID });
    }

    return {
      hash: patient.account.passwordHash,
      salt: patient.account.passwordSalt,
    };
  }

  private async validatePassword(
    body: SignInPatientBodyDTO,
    hash: string,
    salt: string,
    attempt?: AuthAttemptsDTO,
  ): Promise<void> {
    const isValidPassword = await this.encryptionManager.comparePassword(body.password, hash, salt);

    if (isValidPassword) {
      await this.authAttemptManager.handleSuccess(attempt);
    } else {
      await this.authAttemptManager.handleFailure(body.documentNumber, attempt);
    }
  }
}
