import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateEmployeeSessionController,
  ValidateEmployeeSessionControllerBuilder,
} from '../validateEmployeeSessionV1/validateEmployeeSession.controller';

import {
  SendDeepLinkNotificationControllerBuilder,
  ISendDeepLinkNotificationController,
} from './sendDeepLinkNotification.controller';

export class SendDeepLinkNotificationV1Router {
  private readonly version: string = '/v1';
  private readonly sendDeepLinkNotificationController: ISendDeepLinkNotificationController;
  private readonly validateEmployeeSessionController: IValidateEmployeeSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.sendDeepLinkNotificationController = SendDeepLinkNotificationControllerBuilder.build();
    this.validateEmployeeSessionController = ValidateEmployeeSessionControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/notifications/:screen/send`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateEmployeeSessionController.validate.bind(this.validateEmployeeSessionController),
      ),
      handler: this.sendDeepLinkNotificationController.handle.bind(this.sendDeepLinkNotificationController),
    });
  }
}
