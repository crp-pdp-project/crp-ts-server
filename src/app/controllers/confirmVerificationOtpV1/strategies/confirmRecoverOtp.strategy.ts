import { FastifyRequest } from 'fastify';

import {
  ConfirmVerificationOTPBodyDTOSchema,
  ConfirmVerificationOTPInputDTO,
} from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import { IConfirmVerificationOTPInteractor } from 'src/app/interactors/confirmVerificationOtp/confirmVerificationOtp.interactor';
import { Audiences } from 'src/general/enums/audience.enum';

import { IConfirmVerificationOTPControllerStrategy } from '../confirmVerificationOtp.controller';

export class ConfirmRecoverOTPControllerStrategy implements IConfirmVerificationOTPControllerStrategy {
  async execute(
    input: FastifyRequest<ConfirmVerificationOTPInputDTO>,
    interactor: IConfirmVerificationOTPInteractor,
  ): Promise<void> {
    const body = ConfirmVerificationOTPBodyDTOSchema.parse(input.body);
    const session = SessionModel.validateSessionInstance(Audiences.RECOVER, input.session);
    await interactor.confirm(body, session);
  }
}
