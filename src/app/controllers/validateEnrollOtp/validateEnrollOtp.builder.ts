import { ValidateEnrollOTPController } from 'src/app/controllers/validateEnrollOtp/validateEnrollOtp.controller';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { ValidateVerificationOTPInteractor } from 'src/app/interactors/validateVerificationOtp/validateVerificationOtp.interactor';
import { CleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import { GetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { UpdateBlockedRepository } from 'src/app/repositories/database/updateBlocked.repository';
import { UpsertTryCountRepository } from 'src/app/repositories/database/upsertTryCount.repository';
import { ValidateSessionOTPRepository } from 'src/app/repositories/database/validateSessionOTP.repository';
import { AuthAttemptManager } from 'src/general/managers/authAttempt.manager';
import { AuthAttemptEnroll } from 'src/general/managers/config/authAttempt.config';

export class ValidateEnrollOTPBuilder {
  static build(): ValidateEnrollOTPController {
    return new ValidateEnrollOTPController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): ValidateVerificationOTPInteractor {
    return new ValidateVerificationOTPInteractor(this.buildAuthAttemptManager(), new ValidateSessionOTPRepository());
  }

  private static buildAuthAttemptManager(): AuthAttemptManager {
    return new AuthAttemptManager(
      new AuthAttemptEnroll(),
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
