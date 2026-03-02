import type { CreateEnrolledAccountBodyDTO } from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import type { UpdatePatientPasswordBodyDTO } from 'src/app/entities/dtos/input/updatePatientPassword.input.dto';
import type { EnrollSessionModel } from 'src/app/entities/models/session/enrollSession.model';
import type { RecoverSessionModel } from 'src/app/entities/models/session/recoverSession.model';
import type { ICleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';
import { CleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';
import type { IEncryptionManager, PasswordHashResult } from 'src/general/managers/encryption/encryption.manager';
import { EncryptionManagerBuilder } from 'src/general/managers/encryption/encryption.manager';

import { CreatePasswordStrategyBuilder } from './strategies/createPassword.strategy';
import { UpdatePasswordStrategyBuilder } from './strategies/updatePassword.strategy';

type CombinedTransacSession = EnrollSessionModel | RecoverSessionModel;
type CombinedInputBody = CreateEnrolledAccountBodyDTO | UpdatePatientPasswordBodyDTO;

export interface IAccountPasswordStrategy {
  transactionPassword(
    hashedPassword: PasswordHashResult,
    session: CombinedTransacSession,
    body: CombinedInputBody,
  ): Promise<void>;
}

export interface IAccountPasswordInteractor {
  persist(body: CombinedInputBody, session: CombinedTransacSession): Promise<void>;
}

export class AccountPasswordInteractor implements IAccountPasswordInteractor {
  constructor(
    private readonly cleanSession: ICleanSessionRepository,
    private readonly accountPasswordStrategy: IAccountPasswordStrategy,
    private readonly encryptionManager: IEncryptionManager,
  ) {}

  async persist(body: CreateEnrolledAccountBodyDTO, session: EnrollSessionModel): Promise<void> {
    const hashedPassword = await this.generatePassword(body.password);
    await this.accountPasswordStrategy.transactionPassword(hashedPassword, session, body);
    await this.endSession(session.jti, session.patient.id);
  }

  private async generatePassword(password: string): Promise<PasswordHashResult> {
    return this.encryptionManager.hashPassword(password);
  }

  private async endSession(jti: string, patientId: number): Promise<void> {
    await this.cleanSession.execute(jti, patientId);
  }
}

export class AccountPasswordInteractorBuilder {
  static buildCreate(): AccountPasswordInteractor {
    return new AccountPasswordInteractor(
      new CleanSessionRepository(),
      CreatePasswordStrategyBuilder.build(),
      EncryptionManagerBuilder.buildSha512(),
    );
  }
  static buildUpdate(): AccountPasswordInteractor {
    return new AccountPasswordInteractor(
      new CleanSessionRepository(),
      UpdatePasswordStrategyBuilder.build(),
      EncryptionManagerBuilder.buildSha512(),
    );
  }
}
