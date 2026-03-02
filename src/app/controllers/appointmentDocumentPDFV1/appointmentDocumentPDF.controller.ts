import type { FastifyReply, FastifyRequest } from 'fastify';

import type { AppointmentDocumentPDFInputDTO } from 'src/app/entities/dtos/input/appointmentDocumentPDF.input.dto';
import { AppointmentDocumentPDFParamsDTOSchema } from 'src/app/entities/dtos/input/appointmentDocumentPDF.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import type { IAppointmentDocumentPDFInteractor } from 'src/app/interactors/appointmentDocumentPDF/appointmentDocumentPDF.interactor';
import { AppointmentDocumentPDFInteractorBuilder } from 'src/app/interactors/appointmentDocumentPDF/appointmentDocumentPDF.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import type { IResponseManager } from 'src/general/managers/response/response.manager';
import { ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

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
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
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
