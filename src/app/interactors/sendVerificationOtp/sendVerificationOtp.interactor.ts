import { FastifyRequest } from 'fastify';

import { EnrollSessionModel } from 'src/app/entities/models/enrollSession.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { RecoverSessionModel } from 'src/app/entities/models/recoverSession.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IUpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';
import { OTPConstants } from 'src/general/contants/otp.constants';
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
      await this.addOtpToSession(session, otp);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): EnrollSessionModel | RecoverSessionModel {
    const typeInvalid = !(session instanceof RecoverSessionModel) && !(session instanceof EnrollSessionModel);
    if (typeInvalid) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    if ((session.otpSendCount ?? 0) >= OTPConstants.MAX_SEND_COUNT) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.OTP_SEND_LIMIT });
    }

    return session;
  }

  private async addOtpToSession(session: EnrollSessionModel | RecoverSessionModel, otp: string): Promise<void> {
    const newSendCount = (session.otpSendCount ?? 0) + 1;

    await this.updateSessionOtp.execute(session.jti, session.patient.id, otp, newSendCount);
  }
}
