import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { CleanSessionRepository, ICleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';

export interface ISignOutPatientInteractor {
  signOut(session: SignInSessionModel): Promise<void>;
}

export class SignOutPatientInteractor implements ISignOutPatientInteractor {
  constructor(private readonly cleanSession: ICleanSessionRepository) {}

  async signOut(session: SignInSessionModel): Promise<void> {
    await this.cleanSession.execute(session.jti, session.patient.id);
  }
}

export class SignOutPatientInteractorBuilder {
  static build(): SignOutPatientInteractor {
    return new SignOutPatientInteractor(new CleanSessionRepository());
  }
}
