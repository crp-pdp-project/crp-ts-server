import { FastifyReply, FastifyRequest } from 'fastify';

import { ValidateEnrollOTPInputDTO } from 'src/app/entities/dtos/input/validateEnrollOtp.input.dto';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { IValidateEnrollOTPInteractor } from 'src/app/interactors/validateEnrollOtp/validateEnrollOtp.interactor';

export interface IValidateEnrollOTPController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class ValidateEnrollOTPController implements IValidateEnrollOTPController {
  constructor(
    private readonly validateOTPInteractor: IValidateEnrollOTPInteractor,
    private readonly responseInteractor: IResponseInteractor<void>,
  ) {}

  async handle(input: FastifyRequest<ValidateEnrollOTPInputDTO>, reply: FastifyReply): Promise<void> {
    const result = await this.validateOTPInteractor.validate(input);
    const response = this.responseInteractor.execute(result);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
