import { IncomingHttpHeaders } from 'http2';

import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  GetPatientSessionRepository,
  IGetPatientSessionRepository,
} from 'src/app/repositories/database/getPatientSession.repository';
import { UpdateDevicePushTokenRepository } from 'src/app/repositories/database/updateDevicePushToken.repository';
import { UpdateSessionExpireRepository } from 'src/app/repositories/database/updateSessionExpire.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import {
  EnrichedPayload,
  IJWTManager,
  JWTManagerBuilder,
  ValidationResponse,
} from 'src/general/managers/jwt/jwt.manager';

import { ValidateEnrollSessionStrategy } from './strategies/validateEnrollSession.strategy';
import { ValidatePatientSessionStrategy } from './strategies/validatePatientSession.strategy';
import { ValidateRecoverSessionStrategy } from './strategies/validateRecoverSession.strategy';

export interface IValidateSessionStrategy {
  generateSession(
    session: SessionDTO,
    payload: SessionPayloadDTO,
    newExpireAt: string,
    device: DeviceModel,
  ): Promise<SessionModel>;
}

export interface IValidateSessionInteractor {
  execute(headers: IncomingHttpHeaders, device: DeviceModel): Promise<SessionModel>;
}

export class ValidateSessionInteractor implements IValidateSessionInteractor {
  constructor(
    private readonly jwtManager: IJWTManager<SessionPayloadDTO>,
    private readonly strategy: IValidateSessionStrategy,
    private readonly getPatientSession: IGetPatientSessionRepository,
  ) {}

  async execute(headers: IncomingHttpHeaders, device: DeviceModel): Promise<SessionModel> {
    const token = this.extractAndValidateToken(headers);
    const { payload, newExpireAt } = await this.decodeJWEToken(token);
    const session = await this.fetchSession(payload, device);
    const model = await this.strategy.generateSession(session, payload, newExpireAt, device);

    return model;
  }

  private extractAndValidateToken(headers: IncomingHttpHeaders): string {
    const { authorization } = headers;

    if (!authorization?.startsWith('Bearer ')) {
      throw ErrorModel.unauthorized({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return authorization.slice(7);
  }

  private async decodeJWEToken(token: string): Promise<ValidationResponse<SessionPayloadDTO>> {
    const result = await this.jwtManager.verifyToken(token);

    if (!result.payload || !result.payload?.jti) {
      throw ErrorModel.unauthorized({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return result;
  }

  private async fetchSession(payload: EnrichedPayload<SessionPayloadDTO>, device: DeviceModel): Promise<SessionDTO> {
    const session = await this.getPatientSession.execute(payload.jti, device.os!, device.identifier!);
    if (!session) {
      throw ErrorModel.unauthorized({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session;
  }
}

export class ValidateSessionInteractorBuilder {
  static buildSignIn(): ValidateSessionInteractor {
    return new ValidateSessionInteractor(
      JWTManagerBuilder.buildSessionConfig(),
      new ValidatePatientSessionStrategy(new UpdateSessionExpireRepository(), new UpdateDevicePushTokenRepository()),
      new GetPatientSessionRepository(),
    );
  }

  static buildEnroll(): ValidateSessionInteractor {
    return new ValidateSessionInteractor(
      JWTManagerBuilder.buildEnrollConfig(),
      new ValidateEnrollSessionStrategy(),
      new GetPatientSessionRepository(),
    );
  }

  static buildRecover(): ValidateSessionInteractor {
    return new ValidateSessionInteractor(
      JWTManagerBuilder.buildRecoverConfig(),
      new ValidateRecoverSessionStrategy(),
      new GetPatientSessionRepository(),
    );
  }
}
