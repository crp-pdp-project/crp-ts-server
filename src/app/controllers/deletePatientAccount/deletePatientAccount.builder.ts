import { DeletePatientAccountInteractor } from 'src/app/interactors/deletePatientAccount/deletePatientAccountinteractor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { DeletePatientAccountRepository } from 'src/app/repositories/database/deletePatientAccount.repository';

import { DeletePatientAccountController } from './deletePatientAccount.controller';

export class DeletePatientAccountBuilder {
  static build(): DeletePatientAccountController {
    const deletePatientAccount = new DeletePatientAccountRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const createInteractor = new DeletePatientAccountInteractor(deletePatientAccount);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new DeletePatientAccountController(createInteractor, responseInteractor);
  }
}
