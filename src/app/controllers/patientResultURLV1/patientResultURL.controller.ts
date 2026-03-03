import type { FastifyReply, FastifyRequest } from 'fastify';

import type { PatientResultURLInputDTO } from 'src/app/entities/dtos/input/patientResultURL.input.dto';
import {
  PatientResultURLBodyDTOSchema,
  PatientResultURLParamsDTOSchema,
} from 'src/app/entities/dtos/input/patientResultURL.input.dto';
import { PatientResultURLOutputDTOSchema } from 'src/app/entities/dtos/output/patientResultURL.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import type { IPatientResultURLInteractor } from 'src/app/interactors/patientResultURL/patientResultURL.interactor';
import { PatientResultURLInteractorBuilder } from 'src/app/interactors/patientResultURL/patientResultURL.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import type { IResponseManager } from 'src/general/managers/response/response.manager';
import { ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

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
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
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
