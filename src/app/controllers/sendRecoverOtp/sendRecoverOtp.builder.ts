import { SendRecoverOTPController } from 'src/app/controllers/sendRecoverOtp/sendRecoverOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { SendVerificationOTPInteractor } from 'src/app/interactors/sendVerificationOtp/sendVerificationOtp.interactor';
import { SendVerificationRecoverOTPStrategy } from 'src/app/interactors/sendVerificationOtp/strategies/sendVerificationRecoverOTP.strategy';
import { UpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';

export class SendRecoverOTPBuilder {
  static build(): SendRecoverOTPController {
    const updateSessionOTP = new UpdateSessionOTPRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const sendStrategy = new SendVerificationRecoverOTPStrategy();
    const sendOTPInteractor = new SendVerificationOTPInteractor(sendStrategy, updateSessionOTP);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new SendRecoverOTPController(sendOTPInteractor, responseInteractor);
  }
}
