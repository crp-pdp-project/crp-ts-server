import { FastifyReply, FastifyRequest } from 'fastify';

import { UpdateBiometricPasswordInputDTO } from 'src/app/entities/dtos/input/updateBiometricPassword.input.dto';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { IUpdateBiometricPasswordInteractor } from 'src/app/interactors/updateBiometricPassword/updateBiometricPassword.interactor';

export interface IUpdateBiometricPasswordController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class UpdateBiometricPasswordController implements IUpdateBiometricPasswordController {
  constructor(
    private readonly updateBiometricPassword: IUpdateBiometricPasswordInteractor,
    private readonly responseInteractor: IResponseInteractor<void>,
  ) {}

  async handle(input: FastifyRequest<UpdateBiometricPasswordInputDTO>, reply: FastifyReply): Promise<void> {
    const result = await this.updateBiometricPassword.update(input);
    const response = this.responseInteractor.execute(result);
    reply.code(response.statusCode).send(response.body);
  }
}
