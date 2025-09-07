import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import {
  CleanBiometricPasswordRepository,
  ICleanBiometricPasswordRepository,
} from 'src/app/repositories/database/cleanBiometricPassword.repository';

export interface IDeleteBiometricPasswordInteractor {
  delete(session: SignInSessionModel): Promise<void>;
}

export class DeleteBiometricPasswordInteractor implements IDeleteBiometricPasswordInteractor {
  constructor(private readonly cleanBiometricPassword: ICleanBiometricPasswordRepository) {}

  async delete(session: SignInSessionModel): Promise<void> {
    await this.cleanBiometricPassword.execute(session.patient.device.id);
  }
}

export class DeleteBiometricPasswordInteractorBuilder {
  static build(): DeleteBiometricPasswordInteractor {
    return new DeleteBiometricPasswordInteractor(new CleanBiometricPasswordRepository());
  }
}
