import type { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import type { IValidateHeadersController } from '../validateHeadersV1/validateHeaders.controller';
import { ValidateHeadersControllerBuilder } from '../validateHeadersV1/validateHeaders.controller';
import type { IValidateSessionController } from '../validateSessionV1/validateSession.controller';
import { ValidateSessionControllerBuilder } from '../validateSessionV1/validateSession.controller';

import type { IAddDeviceBiometricPasswordController } from './addDeviceBiometricPassword.controller';
import { AddDeviceBiometricPasswordControllerBuilder } from './addDeviceBiometricPassword.controller';

export class AddDeviceBiometricPasswordV1Router {
  private readonly version: string = '/v1';
  private readonly addDeviceBiometricPasswordController: IAddDeviceBiometricPasswordController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.addDeviceBiometricPasswordController = AddDeviceBiometricPasswordControllerBuilder.build();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateSessionController = ValidateSessionControllerBuilder.buildSignIn();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.PATCH,
      url: `${this.version}/patients/biometric-password`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
      ),
      handler: this.addDeviceBiometricPasswordController.handle.bind(this.addDeviceBiometricPasswordController),
    });
  }
}
