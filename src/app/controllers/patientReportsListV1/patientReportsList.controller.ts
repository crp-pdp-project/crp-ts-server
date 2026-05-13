import type { FastifyReply, FastifyRequest } from 'fastify';

import type { PatientReportsListInputDTO } from 'src/app/entities/dtos/input/patientReportsList.input.dto';
import {
  PatientReportsListParamsDTOSchema,
  PatientReportsListQueryDTOSchema,
} from 'src/app/entities/dtos/input/patientReportsList.input.dto';
import { PatientReportsListOutputDTOSchema } from 'src/app/entities/dtos/output/patientReportsList.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import type { IPatientReportsListInteractor } from 'src/app/interactors/patientReportsList/patientReportsList.interactor';
import { PatientReportsListInteractorBuilder } from 'src/app/interactors/patientReportsList/patientReportsList.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import type { IResponseManager } from 'src/general/managers/response/response.manager';
import { ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPatientReportsListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientReportsListController implements IPatientReportsListController {
  private response?: ResponseModel;

  constructor(
    private readonly patientReports: IPatientReportsListInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<PatientReportsListInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = PatientReportsListParamsDTOSchema.parse(input.params);
      const query = PatientReportsListQueryDTOSchema.parse(input.query);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.patientReports.list(params, query, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class PatientReportsListControllerBuilder {
  static build(): PatientReportsListController {
    return new PatientReportsListController(
      PatientReportsListInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(PatientReportsListOutputDTOSchema),
    );
  }
}
