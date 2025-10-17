import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateHeadersController,
  ValidateHeadersControllerBuilder,
} from '../validateHeadersV1/validateHeaders.controller';
import {
  IValidateSafeOperationController,
  ValidateSafeOperationControllerBuilder,
} from '../validateSafeOperationV1/validateSafeOperation.controller';
import {
  IValidateSessionController,
  ValidateSessionControllerBuilder,
} from '../validateSessionV1/validateSession.controller';

import { PatientResultURLControllerBuilder, IPatientResultURLController } from './patientResultURL.controller';

export class PatientResultURLV1Router {
  private readonly version: string = '/v1';
  private readonly patientResultURLController: IPatientResultURLController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateSessionController: IValidateSessionController;
  private readonly validateSafeOperationController: IValidateSafeOperationController;

  constructor(private readonly fastify: FastifyInstance) {
    this.patientResultURLController = PatientResultURLControllerBuilder.build();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateSessionController = ValidateSessionControllerBuilder.buildSignIn();
    this.validateSafeOperationController = ValidateSafeOperationControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/:fmpId/results/url`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
        this.validateSafeOperationController.validate.bind(this.validateSafeOperationController),
      ),
      handler: this.patientResultURLController.handle.bind(this.patientResultURLController),
    });
  }
}
