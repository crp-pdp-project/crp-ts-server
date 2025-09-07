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

import { ISendVerificationOTPController, SendVerificationOTPControllerBuilder } from './sendVerificationOtp.controller';

export class SendVerificationOTPV1Router {
  private readonly version: string = '/v1';
  private readonly sendVerificationEnrollOTPController: ISendVerificationOTPController;
  private readonly sendVerificationRecoverOTPController: ISendVerificationOTPController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateEnrollSessionController: IValidateSessionController;
  private readonly validateRecoverSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.sendVerificationEnrollOTPController = SendVerificationOTPControllerBuilder.buildEnroll();
    this.sendVerificationRecoverOTPController = SendVerificationOTPControllerBuilder.buildRecover();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateEnrollSessionController = ValidateSessionControllerBuilder.buildEnroll();
    this.validateRecoverSessionController = ValidateSessionControllerBuilder.buildRecover();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/enroll/otp/send`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateEnrollSessionController.validate.bind(this.validateEnrollSessionController),
      ),
      handler: this.sendVerificationEnrollOTPController.handle.bind(this.sendVerificationEnrollOTPController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/recover-password/otp/send`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateRecoverSessionController.validate.bind(this.validateRecoverSessionController),
      ),
      handler: this.sendVerificationRecoverOTPController.handle.bind(this.sendVerificationRecoverOTPController),
    });
  }
}
