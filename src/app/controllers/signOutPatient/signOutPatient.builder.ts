import { SignOutPatientController } from 'src/app/controllers/signOutPatient/signOutPatient.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { SignOutPatientInteractor } from 'src/app/interactors/signOutPatient/signOutPatient.interactor';
import { CleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';

export class SignOutPatientBuilder {
  static build(): SignOutPatientController {
    return new SignOutPatientController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): SignOutPatientInteractor {
    return new SignOutPatientInteractor(new CleanSessionRepository());
  }

  private static buildResponseInteractor(): ResponseInteractor<void> {
    return new ResponseInteractor(new EmptyResponseStrategy());
  }
}
