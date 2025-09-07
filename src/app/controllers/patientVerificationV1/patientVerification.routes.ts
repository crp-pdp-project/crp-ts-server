import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateHeadersController,
  ValidateHeadersControllerBuilder,
} from '../validateHeadersV1/validateHeaders.controller';

import { IPatientVerificationController, PatientVerificationControllerBuilder } from './patientVerification.controller';

export class PatientVerificationV1Router {
  private readonly version: string = '/v1';
  private readonly patientVerificationEnrollController: IPatientVerificationController;
  private readonly patientVerificationRecoverController: IPatientVerificationController;
  private readonly validateHeadersController: IValidateHeadersController;

  constructor(private readonly fastify: FastifyInstance) {
    this.patientVerificationEnrollController = PatientVerificationControllerBuilder.buildEnroll();
    this.patientVerificationRecoverController = PatientVerificationControllerBuilder.buildRecover();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/enroll`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
      ),
      handler: this.patientVerificationEnrollController.handle.bind(this.patientVerificationEnrollController),
    });

    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/recover-password`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
      ),
      handler: this.patientVerificationRecoverController.handle.bind(this.patientVerificationRecoverController),
    });
  }
}
