import { FastifyReply, FastifyRequest } from 'fastify';

import { ValidateRecoverOTPInputDTO } from 'src/app/entities/dtos/input/validateRecoverOtp.input.dto';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { IValidateRecoverOTPInteractor } from 'src/app/interactors/validateRecoverOtp/validateRecoverOtp.interactor';

export interface IValidateRecoverOTPController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class ValidateRecoverOTPController implements IValidateRecoverOTPController {
  constructor(
    private readonly validateOTPInteractor: IValidateRecoverOTPInteractor,
    private readonly responseInteractor: IResponseInteractor<void>,
  ) {}

  async handle(input: FastifyRequest<ValidateRecoverOTPInputDTO>, reply: FastifyReply): Promise<void> {
    const result = await this.validateOTPInteractor.validate(input);
    const response = this.responseInteractor.execute(result);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
