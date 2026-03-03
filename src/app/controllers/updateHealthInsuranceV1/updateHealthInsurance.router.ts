import type { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import type { IValidateEmployeeSessionController } from '../validateEmployeeSessionV1/validateEmployeeSession.controller';
import { ValidateEmployeeSessionControllerBuilder } from '../validateEmployeeSessionV1/validateEmployeeSession.controller';

import type { IUpdateHealthInsuranceController } from './updateHealthInsurance.controller';
import { UpdateHealthInsuranceControllerBuilder } from './updateHealthInsurance.controller';

export class UpdateHealthInsuranceV1Router {
  private readonly version: string = '/v1';
  private readonly updateHealthInsuranceController: IUpdateHealthInsuranceController;
  private readonly validateEmployeeSessionController: IValidateEmployeeSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.updateHealthInsuranceController = UpdateHealthInsuranceControllerBuilder.build();
    this.validateEmployeeSessionController = ValidateEmployeeSessionControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.PUT,
      url: `${this.version}/health-insurance`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateEmployeeSessionController.validate.bind(this.validateEmployeeSessionController),
      ),
      handler: this.updateHealthInsuranceController.handle.bind(this.updateHealthInsuranceController),
    });
  }
}
