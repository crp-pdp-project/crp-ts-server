import { SignOutPatientController } from 'src/app/controllers/signOutPatient/signOutPatient.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { SignOutPatientInteractor } from 'src/app/interactors/signOutPatient/signOutPatient.interactor';
import { CleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';

export class SignOutPatientBuilder {
  static build(): SignOutPatientController {
    const cleanSession = new CleanSessionRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const sendOTPInteractor = new SignOutPatientInteractor(cleanSession);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new SignOutPatientController(sendOTPInteractor, responseInteractor);
  }
}
