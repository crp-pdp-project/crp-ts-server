import { ValidateRecoverOTPController } from 'src/app/controllers/validateRecoverOtp/validateRecoverOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { ValidateVerificationOTPInteractor } from 'src/app/interactors/validateVerificationOtp/validateVerificationOtp.interactor';
import { ValidateSessionOTPRepository } from 'src/app/repositories/database/validateSessionOTP.repository';

export class ValidateRecoverOTPBuilder {
  static build(): ValidateRecoverOTPController {
    const validateSessionOTP = new ValidateSessionOTPRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const validateOTPInteractor = new ValidateVerificationOTPInteractor(validateSessionOTP);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new ValidateRecoverOTPController(validateOTPInteractor, responseInteractor);
  }
}
