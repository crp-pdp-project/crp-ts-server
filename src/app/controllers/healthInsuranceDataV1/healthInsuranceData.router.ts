import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateEmployeeSessionController,
  ValidateEmployeeSessionControllerBuilder,
} from '../validateEmployeeSessionV1/validateEmployeeSession.controller';

import { HealthInsuranceDataControllerBuilder, IHealthInsuranceDataController } from './healthInsuranceData.controller';

export class HealthInsuranceDataV1Router {
  private readonly version: string = '/v1';
  private readonly healthInsuranceDataController: IHealthInsuranceDataController;
  private readonly validateEmployeeSessionController: IValidateEmployeeSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.healthInsuranceDataController = HealthInsuranceDataControllerBuilder.build();
    this.validateEmployeeSessionController = ValidateEmployeeSessionControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/health-insurance`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateEmployeeSessionController.validate.bind(this.validateEmployeeSessionController),
      ),
      handler: this.healthInsuranceDataController.handle.bind(this.healthInsuranceDataController),
    });
  }
}
