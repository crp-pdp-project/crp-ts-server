import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateEmployeeSessionController,
  ValidateEmployeeSessionControllerBuilder,
} from '../validateEmployeeSessionV1/validateEmployeeSession.controller';

import { RejectRelativeControllerBuilder, IRejectRelativeController } from './rejectRelative.controller';

export class RejectRelativeV1Router {
  private readonly version: string = '/v1';
  private readonly rejectRelativeController: IRejectRelativeController;
  private readonly validateEmployeeSessionController: IValidateEmployeeSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.rejectRelativeController = RejectRelativeControllerBuilder.build();
    this.validateEmployeeSessionController = ValidateEmployeeSessionControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.DELETE,
      url: `${this.version}/patient/:patientId/relatives/:relativeId/verify`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateEmployeeSessionController.validate.bind(this.validateEmployeeSessionController),
      ),
      handler: this.rejectRelativeController.handle.bind(this.rejectRelativeController),
    });
  }
}
