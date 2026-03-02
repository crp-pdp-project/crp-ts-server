import type { FastifyReply, FastifyRequest } from 'fastify';

import type { BaseHeadersInputDTO } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { IValidateHeadersInteractor } from 'src/app/interactors/validateHeaders/validateHeaders.interactor';
import { ValidateHeadersInteractor } from 'src/app/interactors/validateHeaders/validateHeaders.interactor';
import type { IResponseManager } from 'src/general/managers/response/response.manager';
import { ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IValidateHeadersController {
  validate(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class ValidateHeadersController implements IValidateHeadersController {
  constructor(
    private readonly validateHeadersInteractor: IValidateHeadersInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async validate(input: FastifyRequest<BaseHeadersInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const headers = BaseHeadersDTOSchema.parse(input.headers);
      const device = this.validateHeadersInteractor.validate(headers);
      input.device = device;
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      const errorResponse = this.responseManager.validateResponse(errorModel);
      reply.code(errorResponse.statusCode).send(errorResponse.body);
    }
  }
}

export class ValidateHeadersControllerBuilder {
  static build(): ValidateHeadersController {
    return new ValidateHeadersController(new ValidateHeadersInteractor(), ResponseManagerBuilder.buildError());
  }
}
