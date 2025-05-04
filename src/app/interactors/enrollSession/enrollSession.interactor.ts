import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientEnrollModel } from 'src/app/entities/models/patientEnroll.model';
import { PatientEnrollSessionModel } from 'src/app/entities/models/patientEnrollSession.model';
import { ISaveSessionRepository } from 'src/app/repositories/database/saveSession.respository';
import { IJWTManager } from 'src/general/managers/jwt.manager';

export interface IEnrollSessionInteractor {
  session(model: PatientEnrollModel): Promise<PatientEnrollSessionModel | ErrorModel>;
}

export class EnrollSessionInteractor implements IEnrollSessionInteractor {
  constructor(
    private readonly saveSessionRepository: ISaveSessionRepository,
    private readonly jwtManager: IJWTManager<SessionPayloadDTO>,
  ) {}

  async session(model: PatientEnrollModel): Promise<PatientEnrollSessionModel | ErrorModel> {
    try {
      const { jwt, newSession } = await this.generateJwtToken(model);
      await this.persistSession(newSession);

      return new PatientEnrollSessionModel(model, jwt);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private async generateJwtToken(model: PatientEnrollModel): Promise<{ jwt: string; newSession: SessionDTO }> {
    const payload = model.toSessionPayload();

    const { jwt, jti, expiresAt } = await this.jwtManager.generateToken(payload);

    return {
      jwt,
      newSession: {
        patientId: model.id,
        jti,
        expiresAt,
      },
    };
  }

  private async persistSession(newSession: SessionDTO): Promise<void> {
    await this.saveSessionRepository.execute(newSession);
  }
}
