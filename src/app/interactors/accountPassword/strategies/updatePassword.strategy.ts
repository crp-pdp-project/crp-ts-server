import { RecoverSessionModel } from 'src/app/entities/models/session/recoverSession.model';
import { IUpdatePatientPasswordRepository } from 'src/app/repositories/database/updatePatientPassword.repository';
import { PasswordHashResult } from 'src/general/managers/encryption/encryption.manager';

import { IAccountPasswordStrategy } from '../accountPassword.interactor';

export class UpdatePasswordStrategy implements IAccountPasswordStrategy {
  constructor(private readonly updatePatientPassword: IUpdatePatientPasswordRepository) {}

  async transactionPassword(hashedPassword: PasswordHashResult, session: RecoverSessionModel): Promise<void> {
    await this.updatePatientPassword.execute(session.patient.account.id, {
      passwordHash: hashedPassword.hash,
      passwordSalt: hashedPassword.salt,
    });
  }
}
