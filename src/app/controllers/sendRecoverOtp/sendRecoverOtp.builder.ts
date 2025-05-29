import { SendRecoverOTPController } from 'src/app/controllers/sendRecoverOtp/sendRecoverOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { SendVerificationOTPInteractor } from 'src/app/interactors/sendVerificationOtp/sendVerificationOtp.interactor';
import { SendVerificationRecoverOTPStrategy } from 'src/app/interactors/sendVerificationOtp/strategies/sendVerificationRecoverOTP.strategy';
import { CleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import { GetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { UpdateBlockedRepository } from 'src/app/repositories/database/updateBlocked.repository';
import { UpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';
import { UpsertTryCountRepository } from 'src/app/repositories/database/upsertTryCount.repository';
import { AuthAttemptManager } from 'src/general/managers/authAttempt.manager';
import { AuthAttemptRecover } from 'src/general/managers/config/authAttempt.config';

export class SendRecoverOTPBuilder {
  static build(): SendRecoverOTPController {
    return new SendRecoverOTPController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): SendVerificationOTPInteractor {
    return new SendVerificationOTPInteractor(
      new SendVerificationRecoverOTPStrategy(),
      this.buildAuthAttemptManager(),
      new UpdateSessionOTPRepository(),
    );
  }

  private static buildAuthAttemptManager(): AuthAttemptManager {
    return new AuthAttemptManager(
      new AuthAttemptRecover(),
      new GetAuthAttemptsRepository(),
      new UpsertTryCountRepository(),
      new UpdateBlockedRepository(),
      new CleanBlockedRepository(),
    );
  }

  private static buildResponseInteractor(): ResponseInteractor<void> {
    return new ResponseInteractor(new EmptyResponseStrategy());
  }
}
