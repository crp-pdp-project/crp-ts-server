import { SessionModel } from 'src/app/entities/models/session/session.model';

export interface IValidateSafeOperationInteractor {
  validate(session: SessionModel): void;
}

export class ValidateSafeOperationInteractor implements IValidateSafeOperationInteractor {
  validate(session: SessionModel): void {
    session.validateSafeOperation();
  }
}
