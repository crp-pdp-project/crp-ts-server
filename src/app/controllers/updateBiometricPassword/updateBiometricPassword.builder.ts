import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { UpdateBiometricPasswordInteractor } from 'src/app/interactors/updateBiometricPassword/updateBiometricPassword.interactor';
import { SaveBiometricPasswordRepository } from 'src/app/repositories/database/saveBiometricPassword.repository';
import { EncryptionConfigSha512 } from 'src/general/managers/config/encryption.config';
import { EncryptionManager } from 'src/general/managers/encryption.manager';

import { UpdateBiometricPasswordController } from './updateBiometricPassword.controller';

export class UpdateBiometricPasswordBuilder {
  static build(): UpdateBiometricPasswordController {
    return new UpdateBiometricPasswordController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): UpdateBiometricPasswordInteractor {
    return new UpdateBiometricPasswordInteractor(new SaveBiometricPasswordRepository(), this.buildEncryptionManager());
  }

  private static buildEncryptionManager(): EncryptionManager {
    return new EncryptionManager(new EncryptionConfigSha512());
  }

  private static buildResponseInteractor(): ResponseInteractor<void> {
    return new ResponseInteractor(new EmptyResponseStrategy());
  }
}
