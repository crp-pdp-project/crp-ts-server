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

import {
  ConfirmVerificationOTPControllerBuilder,
  IConfirmVerificationOTPController,
} from './confirmVerificationOtp.controller';

export class ConfirmVerificationOTPV1Router {
  private readonly version: string = '/v1';
  private readonly confirmVerificationEnrollOTP: IConfirmVerificationOTPController;
  private readonly confirmVerificationRecoverOTP: IConfirmVerificationOTPController;
  private readonly confirmVerificationAuthOTP: IConfirmVerificationOTPController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateEnrollSessionController: IValidateSessionController;
  private readonly validateRecoverSessionController: IValidateSessionController;
  private readonly validateSignInSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.confirmVerificationEnrollOTP = ConfirmVerificationOTPControllerBuilder.buildEnroll();
    this.confirmVerificationRecoverOTP = ConfirmVerificationOTPControllerBuilder.buildRecover();
    this.confirmVerificationAuthOTP = ConfirmVerificationOTPControllerBuilder.buildAuth();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateEnrollSessionController = ValidateSessionControllerBuilder.buildEnroll();
    this.validateRecoverSessionController = ValidateSessionControllerBuilder.buildRecover();
    this.validateSignInSessionController = ValidateSessionControllerBuilder.buildSignIn();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/enroll/otp/validate`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateEnrollSessionController.validate.bind(this.validateEnrollSessionController),
      ),
      handler: this.confirmVerificationEnrollOTP.handle.bind(this.confirmVerificationEnrollOTP),
    });

    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/recover-password/otp/validate`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateRecoverSessionController.validate.bind(this.validateRecoverSessionController),
      ),
      handler: this.confirmVerificationRecoverOTP.handle.bind(this.confirmVerificationRecoverOTP),
    });

    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/operation/otp/validate`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSignInSessionController.validate.bind(this.validateSignInSessionController),
      ),
      handler: this.confirmVerificationAuthOTP.handle.bind(this.confirmVerificationAuthOTP),
    });
  }
}
