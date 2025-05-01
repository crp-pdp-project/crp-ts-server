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
    const updatePatientPassowrd = new UpdatePatientPasswordRepository();
    const cleanSession = new CleanSessionRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const encryptionConfig = new EncryptionConfigSha512();
    const encryptionManager = new EncryptionManager(encryptionConfig);
    const updateInteractor = new UpdatePatientPasswordInteractor(
      updatePatientPassowrd,
      cleanSession,
      encryptionManager,
    );
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new UpdatePatientPasswordController(updateInteractor, responseInteractor);
  }
}
