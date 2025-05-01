import { SendEnrollOTPController } from 'src/app/controllers/sendEnrollOtp/sendEnrollOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { SendEnrollOTPInteractor } from 'src/app/interactors/sendEnrollOtp/sendEnrollOtp.interactor';
import { UpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';

export class SendEnrollOTPBuilder {
  static build(): SendEnrollOTPController {
    const updateSessionOTP = new UpdateSessionOTPRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const sendOTPInteractor = new SendEnrollOTPInteractor(updateSessionOTP);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new SendEnrollOTPController(sendOTPInteractor, responseInteractor);
  }
}
