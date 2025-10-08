import { FastifyReply, FastifyRequest } from 'fastify';

import {
  PatientResultURLBodyDTOSchema,
  PatientResultURLInputDTO,
  PatientResultURLParamsDTOSchema,
} from 'src/app/entities/dtos/input/patientResultURL.input.dto';
import { PatientResultURLOutputDTOSchema } from 'src/app/entities/dtos/output/patientResultURL.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  IPatientResultURLInteractor,
  PatientResultURLInteractorBuilder,
} from 'src/app/interactors/patientResultURL/patientResultURL.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPatientResultURLController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientResultURLController implements IPatientResultURLController {
  private response?: ResponseModel;

  constructor(
    private readonly patientResultURL: IPatientResultURLInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<PatientResultURLInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = PatientResultURLParamsDTOSchema.parse(input.params);
      const body = PatientResultURLBodyDTOSchema.parse(input.body);
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      const model = await this.patientResultURL.obtain(body, params, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class PatientResultURLControllerBuilder {
  static build(): PatientResultURLController {
    return new PatientResultURLController(
      PatientResultURLInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(PatientResultURLOutputDTOSchema),
    );
  }
}
