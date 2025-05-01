import { FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { ICleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface ISignOutPatientInteractor {
  signOut(input: FastifyRequest): Promise<void | ErrorModel>;
}

export class SignOutPatientInteractor implements ISignOutPatientInteractor {
  constructor(private readonly cleanSession: ICleanSessionRepository) {}

  async signOut(input: FastifyRequest): Promise<void | ErrorModel> {
    try {
      const session = this.validateSession(input.session);
      await this.deleteSession(session.jti!, session.patient!.id!);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): SessionModel {
    if (!session) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    return session;
  }

  private async deleteSession(jti: string, patientId: number): Promise<void> {
    await this.cleanSession.execute(jti, patientId);
  }
}
