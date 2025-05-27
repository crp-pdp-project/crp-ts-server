import { DeletePatientAccountInteractor } from 'src/app/interactors/deletePatientAccount/deletePatientAccountinteractor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { DeletePatientAccountRepository } from 'src/app/repositories/database/deletePatientAccount.repository';

import { DeletePatientAccountController } from './deletePatientAccount.controller';

export class DeletePatientAccountBuilder {
  static build(): DeletePatientAccountController {
    return new DeletePatientAccountController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): DeletePatientAccountInteractor {
    return new DeletePatientAccountInteractor(new DeletePatientAccountRepository());
  }

  private static buildResponseInteractor(): ResponseInteractor<void> {
    return new ResponseInteractor(new EmptyResponseStrategy());
  }
}
