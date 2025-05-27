import { CreateEnrolledAccountController } from 'src/app/controllers/createEnrolledAccount/createEnrolledAccount.controller';
import { CreateEnrolledAccountInteractor } from 'src/app/interactors/createEnrolledAccount/createEnrolledAccount.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { CleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';
import { SavePatientAccountRepository } from 'src/app/repositories/database/savePatientAccount.repository';
import { EncryptionConfigSha512 } from 'src/general/managers/config/encryption.config';
import { EncryptionManager } from 'src/general/managers/encryption.manager';

export class CreateEnrolledAccountBuilder {
  static build(): CreateEnrolledAccountController {
    return new CreateEnrolledAccountController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): CreateEnrolledAccountInteractor {
    return new CreateEnrolledAccountInteractor(
      new SavePatientAccountRepository(),
      new CleanSessionRepository(),
      this.buildEncryptionManager(),
    );
  }

  private static buildEncryptionManager(): EncryptionManager {
    return new EncryptionManager(new EncryptionConfigSha512());
  }

  private static buildResponseInteractor(): ResponseInteractor<void> {
    return new ResponseInteractor(new EmptyResponseStrategy());
  }
}
