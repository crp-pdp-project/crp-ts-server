import { FastifyRequest } from 'fastify';

import { SessionModel } from 'src/app/entities/models/session/session.model';
import { ISendVerificationOTPInteractor } from 'src/app/interactors/sendVerificationOtp/sendVerificationOtp.interactor';
import { Audiences } from 'src/general/enums/audience.enum';

import { ISendVerificationOTPControllerStrategy } from '../sendVerificationOtp.controller';

export class SendEnrollOTPControllerStrategy implements ISendVerificationOTPControllerStrategy {
  async execute(input: FastifyRequest, interactor: ISendVerificationOTPInteractor): Promise<void> {
    const session = SessionModel.validateSessionInstance(Audiences.ENROLL, input.session);
    await interactor.sendOTP(session);
  }
}
