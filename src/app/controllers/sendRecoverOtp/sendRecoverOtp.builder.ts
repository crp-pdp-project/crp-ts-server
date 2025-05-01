import { SendRecoverOTPController } from 'src/app/controllers/sendRecoverOtp/sendRecoverOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { SendRecoverOTPInteractor } from 'src/app/interactors/sendRecoverOtp/sendRecoverOtp.interactor';
import { UpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';

export class SendRecoverOTPBuilder {
  static build(): SendRecoverOTPController {
    const updateSessionOTP = new UpdateSessionOTPRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const sendOTPInteractor = new SendRecoverOTPInteractor(updateSessionOTP);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new SendRecoverOTPController(sendOTPInteractor, responseInteractor);
  }
}
