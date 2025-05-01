import { ValidateRecoverOTPController } from 'src/app/controllers/validateRecoverOtp/validateRecoverOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { ValidateRecoverOTPInteractor } from 'src/app/interactors/validateRecoverOtp/validateRecoverOtp.interactor';
import { ValidateSessionOTPRepository } from 'src/app/repositories/database/validateSessionOTP.repository';

export class ValidateRecoverOTPBuilder {
  static build(): ValidateRecoverOTPController {
    const validateSessionOTP = new ValidateSessionOTPRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const sendOTPInteractor = new ValidateRecoverOTPInteractor(validateSessionOTP);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new ValidateRecoverOTPController(sendOTPInteractor, responseInteractor);
  }
}
