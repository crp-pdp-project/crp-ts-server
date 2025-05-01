import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error.model';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { IValidateSessionInteractor } from 'src/app/interactors/validateSession/validateSession.interactor';

export interface IValidateSessionController {
  validate(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class ValidateSessionController implements IValidateSessionController {
  constructor(
    private readonly validateInteractor: IValidateSessionInteractor,
    private readonly responseInteractor: IResponseInteractor<void>,
  ) {}

  async validate(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    const session = await this.validateInteractor.execute(input);
    if (session instanceof ErrorModel) {
      const errorResponse = this.responseInteractor.execute(session);
      reply.code(errorResponse.statusCode).send(errorResponse.toResponseObject());
    } else {
      input.session = session;
    }
  }
}
