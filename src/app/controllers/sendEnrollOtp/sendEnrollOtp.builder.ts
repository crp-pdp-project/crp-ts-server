import { SendEnrollOTPController } from 'src/app/controllers/sendEnrollOtp/sendEnrollOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { SendVerificationOTPInteractor } from 'src/app/interactors/sendVerificationOtp/sendVerificationOtp.interactor';
import { SendVerificationEnrollOTPStrategy } from 'src/app/interactors/sendVerificationOtp/strategies/sendVerificationEnrollOTP.strategy';
import { UpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';

export class SendEnrollOTPBuilder {
  static build(): SendEnrollOTPController {
    return new SendEnrollOTPController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): SendVerificationOTPInteractor {
    return new SendVerificationOTPInteractor(new SendVerificationEnrollOTPStrategy(), new UpdateSessionOTPRepository());
  }

  private static buildResponseInteractor(): ResponseInteractor<void> {
    return new ResponseInteractor(new EmptyResponseStrategy());
  }
}
