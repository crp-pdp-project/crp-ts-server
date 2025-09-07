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
  DeleteBiometricPasswordControllerBuilder,
  IDeleteBiometricPasswordController,
} from './deleteBiometricPassword.controller';

export class DeleteBiometricPasswordV1Router {
  private readonly version: string = '/v1';
  private readonly deleteBiometricPassword: IDeleteBiometricPasswordController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.deleteBiometricPassword = DeleteBiometricPasswordControllerBuilder.build();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateSessionController = ValidateSessionControllerBuilder.buildSignIn();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.DELETE,
      url: `${this.version}/patients/biometric-password`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
      ),
      handler: this.deleteBiometricPassword.handle.bind(this.deleteBiometricPassword),
    });
  }
}
