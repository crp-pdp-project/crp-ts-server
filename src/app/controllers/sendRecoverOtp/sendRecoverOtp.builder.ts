import { SendRecoverOTPController } from 'src/app/controllers/sendRecoverOtp/sendRecoverOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { SendVerificationOTPInteractor } from 'src/app/interactors/sendVerificationOtp/sendVerificationOtp.interactor';
import { SendVerificationRecoverOTPStrategy } from 'src/app/interactors/sendVerificationOtp/strategies/sendVerificationRecoverOTP.strategy';
import { UpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';

export class SendRecoverOTPBuilder {
  static build(): SendRecoverOTPController {
    return new SendRecoverOTPController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): SendVerificationOTPInteractor {
    return new SendVerificationOTPInteractor(
      new SendVerificationRecoverOTPStrategy(),
      new UpdateSessionOTPRepository(),
    );
  }

  private static buildResponseInteractor(): ResponseInteractor<void> {
    return new ResponseInteractor(new EmptyResponseStrategy());
  }
}
