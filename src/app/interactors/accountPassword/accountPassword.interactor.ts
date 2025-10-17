import { CreateEnrolledAccountBodyDTO } from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { UpdatePatientPasswordBodyDTO } from 'src/app/entities/dtos/input/updatePatientPassword.input.dto';
import { EnrollSessionModel } from 'src/app/entities/models/session/enrollSession.model';
import { RecoverSessionModel } from 'src/app/entities/models/session/recoverSession.model';
import { CleanSessionRepository, ICleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';
import { SavePatientAccountRepository } from 'src/app/repositories/database/savePatientAccount.repository';
import { UpdatePatientPasswordRepository } from 'src/app/repositories/database/updatePatientPassword.repository';
import {
  EncryptionManagerBuilder,
  IEncryptionManager,
  PasswordHashResult,
} from 'src/general/managers/encryption/encryption.manager';

import { CreatePasswordStrategy } from './strategies/createPassword.strategy';
import { UpdatePasswordStrategy } from './strategies/updatePassword.strategy';

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
      new CreatePasswordStrategy(new SavePatientAccountRepository()),
      EncryptionManagerBuilder.buildSha512(),
    );
  }
  static buildUpdate(): AccountPasswordInteractor {
    return new AccountPasswordInteractor(
      new CleanSessionRepository(),
      new UpdatePasswordStrategy(new UpdatePatientPasswordRepository()),
      EncryptionManagerBuilder.buildSha512(),
    );
  }
}
