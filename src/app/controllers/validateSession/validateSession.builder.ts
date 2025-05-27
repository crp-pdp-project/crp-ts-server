import { ValidateSessionController } from 'src/app/controllers/validateSession/validateSession.controller';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { EmptyResponseStrategy } from 'src/app/interactors/response/strategies/emptyResponse.strategy';
import { ValidateEnrollSessionStrategy } from 'src/app/interactors/validateSession/strategies/validateEnrollSession.strategy';
import { ValidateSignInSessionStrategy } from 'src/app/interactors/validateSession/strategies/validatePatientSession.strategy';
import { ValidateRecoverSessionStrategy } from 'src/app/interactors/validateSession/strategies/validateRecoverSession.strategy';
import {
  IValidateSessionStrategy,
  ValidateSessionInteractor,
} from 'src/app/interactors/validateSession/validateSession.interactor';
import { GetPatientSessionRepository } from 'src/app/repositories/database/getPatientSession.repository';
import { UpdateSessionExpireRepository } from 'src/app/repositories/database/updateSessionExpire.repository';
import {
  IJWTConfig,
  JWTConfigEnroll,
  JWTConfigRecover,
  JWTConfigSession,
} from 'src/general/managers/config/jwt.config';
import { JWTManager } from 'src/general/managers/jwt.manager';

export class ValidateSessionBuilder {
  static buildEnroll(): ValidateSessionController {
    return this.buildController(new JWTConfigEnroll(), new ValidateEnrollSessionStrategy());
  }

  static buildRecover(): ValidateSessionController {
    return this.buildController(new JWTConfigRecover(), new ValidateRecoverSessionStrategy());
  }

  static buildPatient(): ValidateSessionController {
    return this.buildController(
      new JWTConfigSession(),
      new ValidateSignInSessionStrategy(new UpdateSessionExpireRepository()),
    );
  }

  private static buildController(jwtConfig: IJWTConfig, strategy: IValidateSessionStrategy): ValidateSessionController {
    return new ValidateSessionController(this.buildInteractor(strategy, jwtConfig), this.buildResponseInteractor());
  }

  private static buildInteractor(strategy: IValidateSessionStrategy, jwtConfig: IJWTConfig): ValidateSessionInteractor {
    return new ValidateSessionInteractor(
      new JWTManager<SessionPayloadDTO>(jwtConfig),
      strategy,
      new GetPatientSessionRepository(),
    );
  }

  private static buildResponseInteractor(): ResponseInteractor<void> {
    return new ResponseInteractor(new EmptyResponseStrategy());
  }
}
