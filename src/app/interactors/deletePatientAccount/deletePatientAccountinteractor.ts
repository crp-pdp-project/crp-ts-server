import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { CleanSessionRepository, ICleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';
import {
  DeletePatientAccountRepository,
  IDeletePatientAccountRepository,
} from 'src/app/repositories/database/deletePatientAccount.repository';

export interface IDeletePatientAccountInteractor {
  delete(session: SignInSessionModel): Promise<void>;
}

export class DeletePatientAccountInteractor implements IDeletePatientAccountInteractor {
  constructor(
    private readonly deletePatientAccount: IDeletePatientAccountRepository,
    private readonly cleanSession: ICleanSessionRepository,
  ) {}

  async delete(session: SignInSessionModel): Promise<void> {
    await this.deletePatientAccount.execute(session.patient.account.id);
    await this.cleanSession.execute(session.jti, session.patient.id);
  }
}

export class DeletePatientAccountInteractorBuilder {
  static build(): DeletePatientAccountInteractor {
    return new DeletePatientAccountInteractor(new DeletePatientAccountRepository(), new CleanSessionRepository());
  }
}
