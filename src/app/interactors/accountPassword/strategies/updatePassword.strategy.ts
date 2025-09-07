import { RecoverSessionModel } from 'src/app/entities/models/session/recoverSession.model';
import { IUpdatePatientPasswordRepository } from 'src/app/repositories/database/updatePatientPassword.repository';
import { PasswordHashResult } from 'src/general/managers/encryption/encryption.manager';

import { IAccountPassowrdStrategy } from '../accountPassword.interactor';

export class UpdatePasswordStrategy implements IAccountPassowrdStrategy {
  constructor(private readonly updatePatientPassowrd: IUpdatePatientPasswordRepository) {}

  async transactionPassword(hashedPassword: PasswordHashResult, session: RecoverSessionModel): Promise<void> {
    await this.updatePatientPassowrd.execute(session.patient.account.id, {
      passwordHash: hashedPassword.hash,
      passwordSalt: hashedPassword.salt,
    });
  }
}
