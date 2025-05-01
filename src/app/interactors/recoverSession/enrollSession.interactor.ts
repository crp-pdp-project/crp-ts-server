import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientRecoverModel } from 'src/app/entities/models/patientRecover.model';
import { PatientRecoverSessionModel } from 'src/app/entities/models/patientRecoverSession.model';
import { ISaveSessionRepository } from 'src/app/repositories/database/saveSession.respository';
import { IJWTManager } from 'src/general/managers/jwt.manager';

export interface IRecoverSessionInteractor {
  session(model: PatientRecoverModel): Promise<PatientRecoverSessionModel | ErrorModel>;
}

export class RecoverSessionInteractor implements IRecoverSessionInteractor {
  constructor(
    private readonly saveSessionRepository: ISaveSessionRepository,
    private readonly jwtManager: IJWTManager<SessionPayloadDTO>,
  ) {}

  async session(model: PatientRecoverModel): Promise<PatientRecoverSessionModel | ErrorModel> {
    try {
      const { jwt, newSession } = await this.generateJwtToken(model);
      await this.persistSession(newSession);

      return new PatientRecoverSessionModel(model, jwt);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private async generateJwtToken(model: PatientRecoverModel): Promise<{ jwt: string; newSession: SessionDTO }> {
    const payload = model.toSessionPayload();

    const { jwt, jti, expiresAt } = await this.jwtManager.generateToken(payload);

    return {
      jwt,
      newSession: {
        patientId: payload.id,
        jti,
        expiresAt,
      },
    };
  }

  private async persistSession(newSession: SessionDTO): Promise<void> {
    await this.saveSessionRepository.execute(newSession);
  }
}
