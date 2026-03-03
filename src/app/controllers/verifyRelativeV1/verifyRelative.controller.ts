import type { FastifyReply, FastifyRequest } from 'fastify';

import type { OperateRelativeInputDTO } from 'src/app/entities/dtos/input/verifyRelative.input.dto';
import { OperateRelativeParamsDTOSchema } from 'src/app/entities/dtos/input/verifyRelative.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { ResponseModel } from 'src/app/entities/models/response/response.model';
import type { IVerifyRelativeInteractor } from 'src/app/interactors/verifyRelative/verifyRelative.interactor';
import { VerifyRelativeInteractorBuilder } from 'src/app/interactors/verifyRelative/verifyRelative.interactor';
import type { IResponseManager } from 'src/general/managers/response/response.manager';
import { ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IVerifyRelativeController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class VerifyRelativeController implements IVerifyRelativeController {
  private response?: ResponseModel;

  constructor(
    private readonly verifyRelative: IVerifyRelativeInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<OperateRelativeInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = OperateRelativeParamsDTOSchema.parse(input.params);
      await this.verifyRelative.verify(params);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class VerifyRelativeControllerBuilder {
  static build(): VerifyRelativeController {
    return new VerifyRelativeController(VerifyRelativeInteractorBuilder.build(), ResponseManagerBuilder.buildEmpty());
  }
}
