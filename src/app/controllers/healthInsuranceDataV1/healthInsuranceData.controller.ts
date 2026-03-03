import type { FastifyReply, FastifyRequest } from 'fastify';

import { HealthInsuranceDataOutputDTOSchema } from 'src/app/entities/dtos/output/healthInsuranceData.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { ResponseModel } from 'src/app/entities/models/response/response.model';
import type { IHealthInsuranceDataInteractor } from 'src/app/interactors/healthInsurance/healthInsurance';
import { HealthInsuranceDataInteractorBuilder } from 'src/app/interactors/healthInsurance/healthInsurance';
import type { IResponseManager } from 'src/general/managers/response/response.manager';
import { ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IHealthInsuranceDataController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class HealthInsuranceDataController implements IHealthInsuranceDataController {
  private response?: ResponseModel;

  constructor(
    private readonly healthInsuranceData: IHealthInsuranceDataInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(_: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const model = await this.healthInsuranceData.get();
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class HealthInsuranceDataControllerBuilder {
  static build(): HealthInsuranceDataController {
    return new HealthInsuranceDataController(
      HealthInsuranceDataInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(HealthInsuranceDataOutputDTOSchema),
    );
  }
}
