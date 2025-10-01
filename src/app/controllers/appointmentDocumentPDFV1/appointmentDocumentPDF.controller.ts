import { FastifyReply, FastifyRequest } from 'fastify';

import {
  AppointmentDocumentPDFInputDTO,
  AppointmentDocumentPDFParamsDTOSchema,
} from 'src/app/entities/dtos/input/appointmentDocumentPDF.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  AppointmentDocumentPDFInteractorBuilder,
  IAppointmentDocumentPDFInteractor,
} from 'src/app/interactors/appointmentDocumentPDF/appointmentDocumentPDF.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IAppointmentDocumentPDFController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class AppointmentDocumentPDFController implements IAppointmentDocumentPDFController {
  constructor(
    private readonly appointmentPDF: IAppointmentDocumentPDFInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<AppointmentDocumentPDFInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = AppointmentDocumentPDFParamsDTOSchema.parse(input.params);
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      const model = await this.appointmentPDF.obtain(params, session);

      reply
        .header('content-type', model.mimeType)
        .header('content-disposition', `inline; filename="${model.filename}"`)
        .header('content-length', model.contentLength)
        .send(model.toBuffer());
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      const response = this.responseManager.validateResponse(errorModel);
      reply.code(response.statusCode).send(response.body);
    }
  }
}

export class AppointmentDocumentPDFControllerBuilder {
  static build(): AppointmentDocumentPDFController {
    return new AppointmentDocumentPDFController(
      AppointmentDocumentPDFInteractorBuilder.build(),
      ResponseManagerBuilder.buildError(),
    );
  }
}
