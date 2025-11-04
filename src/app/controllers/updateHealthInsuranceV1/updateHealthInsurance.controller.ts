import { FastifyReply, FastifyRequest } from 'fastify';

import {
  UpdateHealthInsuranceBodyDTOSchema,
  UpdateHealthInsuranceInputDTO,
} from 'src/app/entities/dtos/input/updateHealthInsuranceView.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  IUpdateHealthInsuranceInteractor,
  UpdateHealthInsuranceInteractorBuilder,
} from 'src/app/interactors/updateHealthInsurance/updateHealthInsurance.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IUpdateHealthInsuranceController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class UpdateHealthInsuranceController implements IUpdateHealthInsuranceController {
  private response?: ResponseModel;

  constructor(
    private readonly healthInsuranceData: IUpdateHealthInsuranceInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<UpdateHealthInsuranceInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = UpdateHealthInsuranceBodyDTOSchema.parse(input.body);
      await this.healthInsuranceData.verify(body);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class UpdateHealthInsuranceControllerBuilder {
  static build(): UpdateHealthInsuranceController {
    return new UpdateHealthInsuranceController(
      UpdateHealthInsuranceInteractorBuilder.build(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
