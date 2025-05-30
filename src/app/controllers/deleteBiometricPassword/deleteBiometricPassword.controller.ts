import { FastifyReply, FastifyRequest } from 'fastify';

import { IDeleteBiometricPasswordInteractor } from 'src/app/interactors/deleteBiometricPassword/deleteBiometricPassword.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IDeleteBiometricPasswordController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class DeleteBiometricPasswordController implements IDeleteBiometricPasswordController {
  constructor(
    private readonly deleteBiometricPassword: IDeleteBiometricPasswordInteractor,
    private readonly responseInteractor: IResponseInteractor<void>,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    const result = await this.deleteBiometricPassword.delete(input);
    const response = this.responseInteractor.execute(result);
    reply.code(response.statusCode).send(response.body);
  }
}
