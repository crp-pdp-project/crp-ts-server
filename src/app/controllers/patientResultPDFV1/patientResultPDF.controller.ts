import { FastifyReply, FastifyRequest } from 'fastify';

import {
  PatientResultPDFInputDTO,
  PatientResultPDFParamsDTOSchema,
} from 'src/app/entities/dtos/input/patientResultPDF.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  IPatientResultPDFInteractor,
  PatientResultPDFInteractorBuilder,
} from 'src/app/interactors/patientResultPDF/patientResultPDF.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPatientResultPDFController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientResultPDFController implements IPatientResultPDFController {
  constructor(
    private readonly appointmentPDF: IPatientResultPDFInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<PatientResultPDFInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = PatientResultPDFParamsDTOSchema.parse(input.params);
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

export class PatientResultPDFControllerBuilder {
  static build(): PatientResultPDFController {
    return new PatientResultPDFController(
      PatientResultPDFInteractorBuilder.build(),
      ResponseManagerBuilder.buildError(),
    );
  }
}
