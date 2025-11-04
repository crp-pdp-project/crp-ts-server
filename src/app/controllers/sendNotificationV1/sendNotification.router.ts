import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateEmployeeSessionController,
  ValidateEmployeeSessionControllerBuilder,
} from '../validateEmployeeSessionV1/validateEmployeeSession.controller';

import { SendNotificationControllerBuilder, ISendNotificationController } from './sendNotification.controller';

export class SendNotificationV1Router {
  private readonly version: string = '/v1';
  private readonly sendNotificationController: ISendNotificationController;
  private readonly validateEmployeeSessionController: IValidateEmployeeSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.sendNotificationController = SendNotificationControllerBuilder.build();
    this.validateEmployeeSessionController = ValidateEmployeeSessionControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/notifications/send`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateEmployeeSessionController.validate.bind(this.validateEmployeeSessionController),
      ),
      handler: this.sendNotificationController.handle.bind(this.sendNotificationController),
    });
  }
}
