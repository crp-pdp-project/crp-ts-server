import { CreateEnrolledAccountBodyDTO } from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { EnrollSessionModel } from 'src/app/entities/models/session/enrollSession.model';
import { ISavePatientAccountRepository } from 'src/app/repositories/database/savePatientAccount.repository';
import { PasswordHashResult } from 'src/general/managers/encryption/encryption.manager';

import { IAccountPassowrdStrategy } from '../accountPassword.interactor';

export class CreatePasswordStrategy implements IAccountPassowrdStrategy {
  constructor(private readonly savePatientAccount: ISavePatientAccountRepository) {}

  async transactionPassword(
    hashedPassword: PasswordHashResult,
    session: EnrollSessionModel,
    body: CreateEnrolledAccountBodyDTO,
  ): Promise<void> {
    await this.savePatientAccount.execute({
      passwordHash: hashedPassword.hash,
      passwordSalt: hashedPassword.salt,
      acceptTerms: body.acceptTerms,
      acceptAdvertising: body.acceptAdvertising,
      patientId: session.patient.id,
    });
  }
}
