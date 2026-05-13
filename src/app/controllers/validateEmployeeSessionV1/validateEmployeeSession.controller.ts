import type { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { IValidateEmployeeSessionInteractor } from 'src/app/interactors/validateEmployeeSession/validateEmployeeSession.interactor';
import { ValidateEmployeeSessionInteractorBuilder } from 'src/app/interactors/validateEmployeeSession/validateEmployeeSession.interactor';
import type { IResponseManager } from 'src/general/managers/response/response.manager';
import { ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IValidateEmployeeSessionController {
  validate(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class ValidateEmployeeSessionController implements IValidateEmployeeSessionController {
  constructor(
    private readonly validateInteractor: IValidateEmployeeSessionInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async validate(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const session = await this.validateInteractor.execute(input.headers);
      input.employee = session;
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      const errorResponse = this.responseManager.validateResponse(errorModel);
      reply.code(errorResponse.statusCode).send(errorResponse.body);
    }
  }
}

export class ValidateEmployeeSessionControllerBuilder {
  static build(): ValidateEmployeeSessionController {
    return new ValidateEmployeeSessionController(
      ValidateEmployeeSessionInteractorBuilder.build(),
      ResponseManagerBuilder.buildError(),
    );
  }
}
