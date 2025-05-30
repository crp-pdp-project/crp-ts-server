import { DeleteBiometricPasswordInteractor } from 'src/app/interactors/deleteBiometricPassword/deleteBiometricPassword.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { CleanBiometricPasswordRepository } from 'src/app/repositories/database/cleanBiometricPassword.repository';

import { DeleteBiometricPasswordController } from './deleteBiometricPassword.controller';

export class DeleteBiometricPasswordBuilder {
  static build(): DeleteBiometricPasswordController {
    return new DeleteBiometricPasswordController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): DeleteBiometricPasswordInteractor {
    return new DeleteBiometricPasswordInteractor(new CleanBiometricPasswordRepository());
  }

  private static buildResponseInteractor(): ResponseInteractor<void> {
    return new ResponseInteractor(new EmptyResponseStrategy());
  }
}
