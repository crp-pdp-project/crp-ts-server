import { FastifyRequest } from 'fastify';

import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import { ISendVerificationOTPInteractor } from 'src/app/interactors/sendVerificationOtp/sendVerificationOtp.interactor';

import { ISendVerificationOTPControllerStrategy } from '../sendVerificationOtp.controller';

export class SendRecoverOTPControllerStrategy implements ISendVerificationOTPControllerStrategy {
  async execute(input: FastifyRequest, interactor: ISendVerificationOTPInteractor): Promise<void> {
    const session = SessionModel.validateSessionInstance(SessionType.RECOVER, input.session);
    await interactor.sendOTP(session);
  }
}
