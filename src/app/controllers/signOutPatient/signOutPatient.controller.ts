import { FastifyReply, FastifyRequest } from 'fastify';

import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { ISignOutPatientInteractor } from 'src/app/interactors/signOutPatient/signOutPatient.interactor';

export interface ISignOutPatientController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class SignOutPatientController implements ISignOutPatientController {
  constructor(
    private readonly sendOTPInteractor: ISignOutPatientInteractor,
    private readonly responseInteractor: IResponseInteractor<void>,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    const result = await this.sendOTPInteractor.signOut(input);
    const response = this.responseInteractor.execute(result);
    reply.code(response.statusCode).send(response.body);
  }
}
