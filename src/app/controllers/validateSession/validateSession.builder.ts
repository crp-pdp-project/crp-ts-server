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
  private static buildController(jwtConfig: IJWTConfig, strategy: IValidateSessionStrategy): ValidateSessionController {
    const getPatientSession = new GetPatientSessionRepository();
    const jwtManager = new JWTManager<SessionPayloadDTO>(jwtConfig);
    const responseStrategy = new EmptyResponseStrategy();
    const validateInteractor = new ValidateSessionInteractor(jwtManager, strategy, getPatientSession);
    const responseInteractor = new ResponseInteractor<void>(responseStrategy);

    return new ValidateSessionController(validateInteractor, responseInteractor);
  }
  static buildEnroll(): ValidateSessionController {
    const jwtConfig = new JWTConfigEnroll();
    const validateStrategy = new ValidateEnrollSessionStrategy();

    return this.buildController(jwtConfig, validateStrategy);
  }

  static buildRecover(): ValidateSessionController {
    const jwtConfig = new JWTConfigRecover();
    const validateStrategy = new ValidateRecoverSessionStrategy();

    return this.buildController(jwtConfig, validateStrategy);
  }

  static buildPatient(): ValidateSessionController {
    const updateSessionExpire = new UpdateSessionExpireRepository();
    const jwtConfig = new JWTConfigSession();
    const validateStrategy = new ValidateSignInSessionStrategy(updateSessionExpire);

    return this.buildController(jwtConfig, validateStrategy);
  }
}
