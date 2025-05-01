import { FastifyReply, FastifyRequest } from 'fastify';

import { UpdatePatientPasswordInputDTO } from 'src/app/entities/dtos/input/updatePatientPassword.input.dto';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { IUpdatePatientPasswordInteractor } from 'src/app/interactors/updatePatientPassword/updatePatientPassword.interactor';

export interface IUpdatePatientPasswordController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class UpdatePatientPasswordController implements IUpdatePatientPasswordController {
  constructor(
    private readonly updatePatientPassword: IUpdatePatientPasswordInteractor,
    private readonly responseInteractor: IResponseInteractor<void>,
  ) {}

  async handle(input: FastifyRequest<UpdatePatientPasswordInputDTO>, reply: FastifyReply): Promise<void> {
    const result = await this.updatePatientPassword.update(input);
    const response = this.responseInteractor.execute(result);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
