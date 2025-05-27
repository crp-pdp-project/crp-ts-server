import { ValidateRecoverOTPController } from 'src/app/controllers/validateRecoverOtp/validateRecoverOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { ValidateVerificationOTPInteractor } from 'src/app/interactors/validateVerificationOtp/validateVerificationOtp.interactor';
import { CleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import { GetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { UpdateBlockedRepository } from 'src/app/repositories/database/updateBlocked.repository';
import { UpsertTryCountRepository } from 'src/app/repositories/database/upsertTryCount.repository';
import { ValidateSessionOTPRepository } from 'src/app/repositories/database/validateSessionOTP.repository';
import { AuthAttemptManager } from 'src/general/managers/authAttempt.manager';
import { AuthAttemptRecover } from 'src/general/managers/config/authAttempt.config';

export class ValidateRecoverOTPBuilder {
  static build(): ValidateRecoverOTPController {
    return new ValidateRecoverOTPController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): ValidateVerificationOTPInteractor {
    return new ValidateVerificationOTPInteractor(this.buildAuthAttemptManager(), new ValidateSessionOTPRepository());
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
