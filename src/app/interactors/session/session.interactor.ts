import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ISaveSessionRepository } from 'src/app/repositories/database/saveSession.respository';
import { IJWTManager } from 'src/general/managers/jwt.manager';

export interface ISessionStrategy<TInput, TOutput> {
  toPayload(input: TInput): Promise<SessionPayloadDTO>;
  toResponse(input: TInput, jwt: string): TOutput;
}

export interface ISessionInteractor<TInput, TOutput> {
  session(model: TInput): Promise<TOutput | ErrorModel>;
}

export class SessionInteractor<TInput, TOutput> implements ISessionInteractor<TInput, TOutput> {
  constructor(
    private readonly sessionStrategy: ISessionStrategy<TInput, TOutput>,
    private readonly saveSessionRepository: ISaveSessionRepository,
    private readonly jwtManager: IJWTManager<SessionPayloadDTO>,
  ) {}

  async session(model: TInput): Promise<TOutput | ErrorModel> {
    try {
      const payload = await this.sessionStrategy.toPayload(model);
      const { jwt, newSession } = await this.generateJwtToken(payload);
      await this.persistSession(newSession);

      return this.sessionStrategy.toResponse(model, jwt);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private async generateJwtToken(payload: SessionPayloadDTO): Promise<{ jwt: string; newSession: SessionDTO }> {
    const { jwt, jti, expiresAt } = await this.jwtManager.generateToken(payload);

    return {
      jwt,
      newSession: {
        patientId: payload.patient?.id,
        jti,
        expiresAt,
      },
    };
  }

  private async persistSession(newSession: SessionDTO): Promise<void> {
    await this.saveSessionRepository.execute(newSession);
  }
}
