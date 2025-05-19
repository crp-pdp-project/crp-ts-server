import { FastifyRequest } from 'fastify';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { EnrollSessionModel } from 'src/app/entities/models/enrollSession.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { RecoverSessionModel } from 'src/app/entities/models/recoverSession.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IUpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface ISendVerificationOTPStrategy {
  sendOTP(session?: EnrollSessionModel | RecoverSessionModel): Promise<string>;
}

export interface ISendVerificationOTPInteractor {
  send(input: FastifyRequest): Promise<void | ErrorModel>;
}

export class SendVerificationOTPInteractor implements ISendVerificationOTPInteractor {
  constructor(
    private readonly sendStrategy: ISendVerificationOTPStrategy,
    private readonly updateSessionOtp: IUpdateSessionOTPRepository,
  ) {}

  async send(input: FastifyRequest): Promise<void | ErrorModel> {
    try {
      const session = this.validateSession(input.session);
      const otp = await this.sendStrategy.sendOTP(session);
      await this.addOtpToSession(session.jti, session.patient.id, otp);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): EnrollSessionModel | RecoverSessionModel {
    const typeInvalid = !(session instanceof RecoverSessionModel) && !(session instanceof EnrollSessionModel);
    if (typeInvalid) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    return session;
  }

  private async addOtpToSession(jti: SessionDM['jti'], patientId: PatientDM['id'], otp: string): Promise<void> {
    await this.updateSessionOtp.execute(jti, patientId, otp);
  }
}
