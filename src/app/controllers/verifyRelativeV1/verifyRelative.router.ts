import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateEmployeeSessionController,
  ValidateEmployeeSessionControllerBuilder,
} from '../validateEmployeeSessionV1/validateEmployeeSession.controller';

import { VerifyRelativeControllerBuilder, IVerifyRelativeController } from './verifyRelative.controller';

export class VerifyRelativeV1Router {
  private readonly version: string = '/v1';
  private readonly verifyRelativeController: IVerifyRelativeController;
  private readonly validateEmployeeSessionController: IValidateEmployeeSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.verifyRelativeController = VerifyRelativeControllerBuilder.build();
    this.validateEmployeeSessionController = ValidateEmployeeSessionControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.PATCH,
      url: `${this.version}/patient/:patientId/relatives/:relativeId/verify`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateEmployeeSessionController.validate.bind(this.validateEmployeeSessionController),
      ),
      handler: this.verifyRelativeController.handle.bind(this.verifyRelativeController),
    });
  }
}
