import { FastifyReply, FastifyRequest } from 'fastify';

import {
  OperateX12BodyDTOSchema,
  OperateX12InputDTO,
  OperateX12ParamsDTOSchema,
} from 'src/app/entities/dtos/input/operateX12.input.dto';
import { OperateX12OutputDTOSchema } from 'src/app/entities/dtos/output/operateX12.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  IOperateX12Interactor,
  OperateX12InteractorBuilder,
} from 'src/app/interactors/operateX12/operateX12.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IOperateX12Controller {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class OperateX12Controller implements IOperateX12Controller {
  private response?: ResponseModel;

  constructor(
    private readonly operateX12Interactor: IOperateX12Interactor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<OperateX12InputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = OperateX12ParamsDTOSchema.parse(input.params);
      const body = OperateX12BodyDTOSchema.parse(input.body);
      const model = await this.operateX12Interactor.operate(params, body);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class OperateX12ControllerBuilder {
  static build(): OperateX12Controller {
    return new OperateX12Controller(
      OperateX12InteractorBuilder.build(),
      ResponseManagerBuilder.buildData(OperateX12OutputDTOSchema),
    );
  }
}
