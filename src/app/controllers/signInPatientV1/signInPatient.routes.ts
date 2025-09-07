import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateHeadersController,
  ValidateHeadersControllerBuilder,
} from '../validateHeadersV1/validateHeaders.controller';

import { ISignInPatientController, SignInPatientControllerBuilder } from './signInPatient.controller';

export class SignInPatientV1Router {
  private readonly version: string = '/v1';
  private readonly signInPatientController: ISignInPatientController;
  private readonly signInBiometricController: ISignInPatientController;
  private readonly validateHeadersController: IValidateHeadersController;

  constructor(private readonly fastify: FastifyInstance) {
    this.signInPatientController = SignInPatientControllerBuilder.buildRegular();
    this.signInBiometricController = SignInPatientControllerBuilder.buildBiometric();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/sign-in`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
      ),
      handler: this.signInPatientController.handle.bind(this.signInPatientController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/sign-in/biometric`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
      ),
      handler: this.signInBiometricController.handle.bind(this.signInBiometricController),
    });
  }
}
