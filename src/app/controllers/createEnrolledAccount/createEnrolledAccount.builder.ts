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
    const savePatientAccount = new SavePatientAccountRepository();
    const cleanSession = new CleanSessionRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const encryptionConfig = new EncryptionConfigSha512();
    const encryptionManager = new EncryptionManager(encryptionConfig);
    const createInteractor = new CreateEnrolledAccountInteractor(savePatientAccount, cleanSession, encryptionManager);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new CreateEnrolledAccountController(createInteractor, responseInteractor);
  }
}
