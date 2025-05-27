import { FastifyRequest } from 'fastify';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { ICleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface ISignOutPatientInteractor {
  signOut(input: FastifyRequest): Promise<void | ErrorModel>;
}

export class SignOutPatientInteractor implements ISignOutPatientInteractor {
  constructor(private readonly cleanSession: ICleanSessionRepository) {}

  async signOut(input: FastifyRequest): Promise<void | ErrorModel> {
    try {
      const session = this.validateSession(input.session);
      await this.deleteSession(session.jti, session.patient.id);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): SignInSessionModel {
    if (!(session instanceof SignInSessionModel)) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session;
  }

  private async deleteSession(jti: SessionDM['jti'], patientId: PatientDM['id']): Promise<void> {
    await this.cleanSession.execute(jti, patientId);
  }
}
