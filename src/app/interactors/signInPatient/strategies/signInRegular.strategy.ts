import { SignInPatientBodyDTO } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { AuthAttemptModel } from 'src/app/entities/models/authAttempt/authAttempt.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { ICleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import { ISignInPatientRepository } from 'src/app/repositories/database/signInPatient.repository';
import { IUpdateBlockedRepository } from 'src/app/repositories/database/updateBlocked.repository';
import { IUpsertTryCountRepository } from 'src/app/repositories/database/upsertTryCount.repository';
import { IEncryptionManager } from 'src/general/managers/encryption/encryption.manager';

import { ISignInStrategy } from '../signInPatient.interactor';

export class SignInRegularStrategy implements ISignInStrategy {
  constructor(
    private readonly signInPatient: ISignInPatientRepository,
    private readonly encryptionManager: IEncryptionManager,
    private readonly upsertTryCount: IUpsertTryCountRepository,
    private readonly updateBlocked: IUpdateBlockedRepository,
    private readonly cleanBlocked: ICleanBlockedRepository,
  ) {}

  async verifySignIn(body: SignInPatientBodyDTO, attempt: AuthAttemptModel): Promise<PatientModel> {
    const patient = await this.getPatientAccount(body);
    await this.validateSignIn(body.password, patient, attempt);

    return patient;
  }

  private async getPatientAccount(body: SignInPatientBodyDTO): Promise<PatientModel> {
    const patient = await this.signInPatient.execute(body.documentType, body.documentNumber);

    return new PatientModel(patient ?? {});
  }

  private async handleAttemptFailure(attempt: AuthAttemptModel): Promise<void> {
    const isBlocked = attempt.isBlockedAfterFailure();

    if (isBlocked) {
      await this.updateBlocked.execute(attempt.id!, attempt.blockExpiresAt!);
      throw ErrorModel.locked({ detail: attempt.authAttemptConfig.blockErrorMessage });
    }

    await this.upsertTryCount.execute({
      documentNumber: attempt.documentNumber,
      flowIdentifier: attempt.flowIdentifier,
      tryCount: attempt.tryCount,
      tryCountExpiresAt: attempt.tryCountExpiresAt,
    });
    throw ErrorModel.unauthorized({ detail: attempt.authAttemptConfig.tryErrorMessage });
  }

  private async validateSignIn(password: string, patient: PatientModel, attempt: AuthAttemptModel): Promise<void> {
    const isValidPassword = await this.encryptionManager.comparePassword(
      password,
      patient.account?.passwordHash ?? '',
      patient.account?.passwordSalt ?? '',
    );

    if (isValidPassword) {
      await this.cleanBlocked.execute(attempt.documentNumber);
    } else {
      await this.handleAttemptFailure(attempt);
    }
  }
}
