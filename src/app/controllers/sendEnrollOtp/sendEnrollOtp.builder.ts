import { SendEnrollOTPController } from 'src/app/controllers/sendEnrollOtp/sendEnrollOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { SendVerificationOTPInteractor } from 'src/app/interactors/sendVerificationOtp/sendVerificationOtp.interactor';
import { SendVerificationEnrollOTPStrategy } from 'src/app/interactors/sendVerificationOtp/strategies/sendVerificationEnrollOTP.strategy';
import { UpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';

export class SendEnrollOTPBuilder {
  static build(): SendEnrollOTPController {
    const updateSessionOTP = new UpdateSessionOTPRepository();
    const responseStrategy = new EmptyResponseStrategy();
    const sendStrategy = new SendVerificationEnrollOTPStrategy();
    const sendOTPInteractor = new SendVerificationOTPInteractor(sendStrategy, updateSessionOTP);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new SendEnrollOTPController(sendOTPInteractor, responseInteractor);
  }
}
