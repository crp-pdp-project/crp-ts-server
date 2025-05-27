import { IncomingHttpHeaders } from 'http';

import { FastifyRequest } from 'fastify';

import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IGetPatientSessionRepository } from 'src/app/repositories/database/getPatientSession.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { EnrichedPayload, IJWTManager, ValidationResponse } from 'src/general/managers/jwt.manager';

export interface IValidateSessionStrategy {
  generateSession(session: SessionDTO, payload: SessionPayloadDTO, newExpireAt: string): Promise<SessionModel>;
}

export interface IValidateSessionInteractor {
  execute(input: FastifyRequest): Promise<SessionModel | ErrorModel>;
}

export class ValidateSessionInteractor implements IValidateSessionInteractor {
  constructor(
    private readonly jwtManager: IJWTManager<SessionPayloadDTO>,
    private readonly strategy: IValidateSessionStrategy,
    private readonly getPatientSession: IGetPatientSessionRepository,
  ) {}

  async execute(input: FastifyRequest): Promise<SessionModel | ErrorModel> {
    try {
      const token = this.extractAndValidateToken(input.headers);
      const { payload, newExpireAt } = await this.decodeJWEToken(token);
      const session = await this.fetchSession(payload);
      const model = await this.strategy.generateSession(session, payload, newExpireAt);

      return model;
    } catch (error) {
      return ErrorModel.fromError(error);
    }
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

  private async fetchSession(payload: EnrichedPayload<SessionPayloadDTO>): Promise<SessionDTO> {
    const session = await this.getPatientSession.execute(payload.jti);

    if (!session) {
      throw ErrorModel.unauthorized({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session;
  }
}
