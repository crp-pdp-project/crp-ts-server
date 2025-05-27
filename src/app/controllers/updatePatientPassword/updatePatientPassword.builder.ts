import { UpdatePatientPasswordController } from 'src/app/controllers/updatePatientPassword/updatePatientPassword.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { UpdatePatientPasswordInteractor } from 'src/app/interactors/updatePatientPassword/updatePatientPassword.interactor';
import { CleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';
import { UpdatePatientPasswordRepository } from 'src/app/repositories/database/updatePatientPassword.repository';
import { EncryptionConfigSha512 } from 'src/general/managers/config/encryption.config';
import { EncryptionManager } from 'src/general/managers/encryption.manager';

export class UpdatePatientPasswordBuilder {
  static build(): UpdatePatientPasswordController {
    return new UpdatePatientPasswordController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): UpdatePatientPasswordInteractor {
    return new UpdatePatientPasswordInteractor(
      new UpdatePatientPasswordRepository(),
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
