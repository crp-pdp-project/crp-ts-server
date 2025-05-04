import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientModel } from 'src/app/entities/models/patient.model';
import { PatientSessionModel } from 'src/app/entities/models/patientSession.model';
import { ISaveSessionRepository } from 'src/app/repositories/database/saveSession.respository';
import { IJWTManager } from 'src/general/managers/jwt.manager';

export interface ISignInSessionInteractor {
  session(model: PatientModel): Promise<PatientSessionModel | ErrorModel>;
}

export class SignInSessionInteractor implements ISignInSessionInteractor {
  constructor(
    private readonly saveSessionRepository: ISaveSessionRepository,
    private readonly jwtManager: IJWTManager<SessionPayloadDTO>,
  ) {}

  async session(model: PatientModel): Promise<PatientSessionModel | ErrorModel> {
    try {
      const { jwt, newSession } = await this.generateJwtToken(model);
      await this.persistSession(newSession);

      return new PatientSessionModel(model, jwt);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private async generateJwtToken(model: PatientModel): Promise<{ jwt: string; newSession: SessionDTO }> {
    const { jwt, jti, expiresAt } = await this.jwtManager.generateToken();

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
