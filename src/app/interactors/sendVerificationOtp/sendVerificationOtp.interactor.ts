import { FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IUpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface ISendVerificationOTPStrategy {
  sendOtp(session: SessionModel): Promise<string>;
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
      const otp = await this.sendStrategy.sendOtp(session);
      await this.addOtpToSession(session.jti!, session.patient!.id!, otp);
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

  private async addOtpToSession(jti: string, patientId: number, otp: string): Promise<void> {
    await this.updateSessionOtp.execute(jti, patientId, otp);
  }
}
