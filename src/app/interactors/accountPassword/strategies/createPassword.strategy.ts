import type { CreateEnrolledAccountBodyDTO } from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import type { EnrollSessionModel } from 'src/app/entities/models/session/enrollSession.model';
import type { ISavePatientAccountRepository } from 'src/app/repositories/database/savePatientAccount.repository';
import { SavePatientAccountRepository } from 'src/app/repositories/database/savePatientAccount.repository';
import type { PasswordHashResult } from 'src/general/managers/encryption/encryption.manager';

import type { IAccountPasswordStrategy } from '../accountPassword.interactor';

export class CreatePasswordStrategy implements IAccountPasswordStrategy {
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

export class CreatePasswordStrategyBuilder {
  static build(): CreatePasswordStrategy {
    return new CreatePasswordStrategy(new SavePatientAccountRepository());
  }
}
