import { FastifyReply, FastifyRequest } from 'fastify';

import { ValidateVerificationOTPInputDTO } from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { IValidateVerificationOTPInteractor } from 'src/app/interactors/validateVerificationOtp/validateVerificationOtp.interactor';

export interface IValidateRecoverOTPController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class ValidateRecoverOTPController implements IValidateRecoverOTPController {
  constructor(
    private readonly validateOTPInteractor: IValidateVerificationOTPInteractor,
    private readonly responseInteractor: IResponseInteractor<void>,
  ) {}

  async handle(input: FastifyRequest<ValidateVerificationOTPInputDTO>, reply: FastifyReply): Promise<void> {
    const result = await this.validateOTPInteractor.validate(input);
    const response = this.responseInteractor.execute(result);
    reply.code(response.statusCode).send(response.body);
  }
}
