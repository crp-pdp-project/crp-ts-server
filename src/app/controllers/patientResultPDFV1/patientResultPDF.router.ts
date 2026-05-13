import type { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import type { IValidateHeadersController } from '../validateHeadersV1/validateHeaders.controller';
import { ValidateHeadersControllerBuilder } from '../validateHeadersV1/validateHeaders.controller';
import type { IValidateSafeOperationController } from '../validateSafeOperationV1/validateSafeOperation.controller';
import { ValidateSafeOperationControllerBuilder } from '../validateSafeOperationV1/validateSafeOperation.controller';
import type { IValidateSessionController } from '../validateSessionV1/validateSession.controller';
import { ValidateSessionControllerBuilder } from '../validateSessionV1/validateSession.controller';

import type { IPatientResultPDFController } from './patientResultPDF.controller';
import { PatientResultPDFControllerBuilder } from './patientResultPDF.controller';

export class PatientResultPDFV1Router {
  private readonly version: string = '/v1';
  private readonly patientResultPDFController: IPatientResultPDFController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateSessionController: IValidateSessionController;
  private readonly validateSafeOperationController: IValidateSafeOperationController;

  constructor(private readonly fastify: FastifyInstance) {
    this.patientResultPDFController = PatientResultPDFControllerBuilder.build();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateSessionController = ValidateSessionControllerBuilder.buildSignIn();
    this.validateSafeOperationController = ValidateSafeOperationControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients/:fmpId/results/documents/:resultId`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
        this.validateSafeOperationController.validate.bind(this.validateSafeOperationController),
      ),
      handler: this.patientResultPDFController.handle.bind(this.patientResultPDFController),
    });
  }
}
