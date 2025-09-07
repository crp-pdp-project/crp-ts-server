import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateHeadersController,
  ValidateHeadersControllerBuilder,
} from '../validateHeadersV1/validateHeaders.controller';
import {
  IValidateSessionController,
  ValidateSessionControllerBuilder,
} from '../validateSessionV1/validateSession.controller';

import { AccountPasswordControllerBuilder, IAccountPasswordController } from './accountPassword.controller';

export class AccountPasswordV1Router {
  private readonly version: string = '/v1';
  private readonly createAccountPasswordController: IAccountPasswordController;
  private readonly updateAccountPasswordController: IAccountPasswordController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateEnrollSessionController: IValidateSessionController;
  private readonly validateRecoverSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.createAccountPasswordController = AccountPasswordControllerBuilder.buildCreate();
    this.updateAccountPasswordController = AccountPasswordControllerBuilder.buildUpdate();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateEnrollSessionController = ValidateSessionControllerBuilder.buildEnroll();
    this.validateRecoverSessionController = ValidateSessionControllerBuilder.buildRecover();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/account`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateEnrollSessionController.validate.bind(this.validateEnrollSessionController),
      ),
      handler: this.createAccountPasswordController.handle.bind(this.createAccountPasswordController),
    });
    this.fastify.route({
      method: HttpMethod.PATCH,
      url: `${this.version}/patients/password`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateRecoverSessionController.validate.bind(this.validateRecoverSessionController),
      ),
      handler: this.updateAccountPasswordController.handle.bind(this.updateAccountPasswordController),
    });
  }
}
