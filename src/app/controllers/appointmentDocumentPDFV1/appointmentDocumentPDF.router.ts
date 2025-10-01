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
  AppointmentDocumentPDFControllerBuilder,
  IAppointmentDocumentPDFController,
} from './appointmentDocumentPDF.controller';

export class AppointmentDocumentPDFV1Router {
  private readonly version: string = '/v1';
  private readonly appointmentDocumentPDF: IAppointmentDocumentPDFController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.appointmentDocumentPDF = AppointmentDocumentPDFControllerBuilder.build();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateSessionController = ValidateSessionControllerBuilder.buildSignIn();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients/:fmpId/appointments/documents/:documentId`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
      ),
      handler: this.appointmentDocumentPDF.handle.bind(this.appointmentDocumentPDF),
    });
  }
}
