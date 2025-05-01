import { FastifyReply, FastifyRequest } from 'fastify';

import { CreateEnrolledAccountInputDTO } from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { ICreateEnrolledAccountInteractor } from 'src/app/interactors/createEnrolledAccount/createEnrolledAccount.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface ICreateEnrolledAccountController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class CreateEnrolledAccountController implements ICreateEnrolledAccountController {
  constructor(
    private readonly createEnrolledAccount: ICreateEnrolledAccountInteractor,
    private readonly responseInteractor: IResponseInteractor<void>,
  ) {}

  async handle(input: FastifyRequest<CreateEnrolledAccountInputDTO>, reply: FastifyReply): Promise<void> {
    const result = await this.createEnrolledAccount.create(input);
    const response = this.responseInteractor.execute(result);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
