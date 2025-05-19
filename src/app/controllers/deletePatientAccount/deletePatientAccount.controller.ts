import { FastifyReply, FastifyRequest } from 'fastify';

import { IDeletePatientAccountInteractor } from 'src/app/interactors/deletePatientAccount/deletePatientAccountinteractor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IDeletePatientAccountController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class DeletePatientAccountController implements IDeletePatientAccountController {
  constructor(
    private readonly deletePatientAccount: IDeletePatientAccountInteractor,
    private readonly responseInteractor: IResponseInteractor<void>,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    const result = await this.deletePatientAccount.delete(input);
    const response = this.responseInteractor.execute(result);
    reply.code(response.statusCode).send(response.body);
  }
}
