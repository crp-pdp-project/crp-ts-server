import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { UpdateBiometricPasswordInteractor } from 'src/app/interactors/updateBiometricPassword/updateBiometricPassword.interactor';
import { SaveBiometricPasswordRepository } from 'src/app/repositories/database/saveBiometricPassword.repository';
import { EncryptionConfigSha512 } from 'src/general/managers/config/encryption.config';
import { EncryptionManager } from 'src/general/managers/encryption.manager';

import { UpdateBiometricPasswordController } from './updateBiometricPassword.controller';

export class UpdateBiometricPasswordBuilder {
  static build(): UpdateBiometricPasswordController {
    const saveBiometricPassword = new SaveBiometricPasswordRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const encryptionConfig = new EncryptionConfigSha512();
    const encryptionManager = new EncryptionManager(encryptionConfig);
    const updateInteractor = new UpdateBiometricPasswordInteractor(saveBiometricPassword, encryptionManager);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new UpdateBiometricPasswordController(updateInteractor, responseInteractor);
  }
}
