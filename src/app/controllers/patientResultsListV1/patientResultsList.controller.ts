import { FastifyReply, FastifyRequest } from 'fastify';

import {
  PatientResultsListInputDTO,
  PatientResultsListParamsDTOSchema,
  PatientResultsListQueryDTOSchema,
} from 'src/app/entities/dtos/input/patientResultsList.input.dto';
import { PatientResultsListOutputDTOSchema } from 'src/app/entities/dtos/output/patientResultsList.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  IPatientResultsListInteractor,
  PatientResultsListInteractorBuilder,
} from 'src/app/interactors/patientResultsList/patientResultsList.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPatientResultsListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientResultsListController implements IPatientResultsListController {
  private response?: ResponseModel;

  constructor(
    private readonly patientResults: IPatientResultsListInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<PatientResultsListInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = PatientResultsListParamsDTOSchema.parse(input.params);
      const query = PatientResultsListQueryDTOSchema.parse(input.query);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.patientResults.list(params, query, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class PatientResultsListControllerBuilder {
  static build(): PatientResultsListController {
    return new PatientResultsListController(
      PatientResultsListInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(PatientResultsListOutputDTOSchema),
    );
  }
}
