import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  IValidateSafeOperationInteractor,
  ValidateSafeOperationInteractor,
} from 'src/app/interactors/validateSafeOperation/validateSafeOperation.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IValidateSafeOperationController {
  validate(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class ValidateSafeOperationController implements IValidateSafeOperationController {
  constructor(
    private readonly validateHeadersInteractor: IValidateSafeOperationInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async validate(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const session = SessionModel.validateRawSession(input.session);
      this.validateHeadersInteractor.validate(session);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      const errorResponse = this.responseManager.validateResponse(errorModel);
      reply.code(errorResponse.statusCode).send(errorResponse.body);
    }
  }
}

export class ValidateSafeOperationControllerBuilder {
  static build(): ValidateSafeOperationController {
    return new ValidateSafeOperationController(
      new ValidateSafeOperationInteractor(),
      ResponseManagerBuilder.buildError(),
    );
  }
}
