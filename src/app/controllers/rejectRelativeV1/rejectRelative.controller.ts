import { FastifyReply, FastifyRequest } from 'fastify';

import {
  OperateRelativeInputDTO,
  OperateRelativeParamsDTOSchema,
} from 'src/app/entities/dtos/input/verifyRelative.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  IRejectRelativeInteractor,
  RejectRelativeInteractorBuilder,
} from 'src/app/interactors/rejectRelative/rejectRelative.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IRejectRelativeController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class RejectRelativeController implements IRejectRelativeController {
  private response?: ResponseModel;

  constructor(
    private readonly rejectRelative: IRejectRelativeInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<OperateRelativeInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = OperateRelativeParamsDTOSchema.parse(input.params);
      await this.rejectRelative.reject(params);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class RejectRelativeControllerBuilder {
  static build(): RejectRelativeController {
    return new RejectRelativeController(RejectRelativeInteractorBuilder.build(), ResponseManagerBuilder.buildEmpty());
  }
}
