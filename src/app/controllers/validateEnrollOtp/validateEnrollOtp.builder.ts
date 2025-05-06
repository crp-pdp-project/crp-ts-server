import { ValidateEnrollOTPController } from 'src/app/controllers/validateEnrollOtp/validateEnrollOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { ValidateVerificationOTPInteractor } from 'src/app/interactors/validateVerificationOtp/validateVerificationOtp.interactor';
import { ValidateSessionOTPRepository } from 'src/app/repositories/database/validateSessionOTP.repository';

export class ValidateEnrollOTPBuilder {
  static build(): ValidateEnrollOTPController {
    const validateSessionOTP = new ValidateSessionOTPRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const validateOTPInteractor = new ValidateVerificationOTPInteractor(validateSessionOTP);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new ValidateEnrollOTPController(validateOTPInteractor, responseInteractor);
  }
}
