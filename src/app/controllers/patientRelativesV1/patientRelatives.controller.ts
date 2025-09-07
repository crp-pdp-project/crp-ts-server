import { FastifyReply, FastifyRequest } from 'fastify';

import { PatientRelativesOutputDTOSchema } from 'src/app/entities/dtos/output/patientRelatives.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  IPatientRelativesInteractor,
  PatientRelativesInteractorBuilder,
} from 'src/app/interactors/patientRelatives/patientRelatives.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPatientRelativesController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientRelativesController implements IPatientRelativesController {
  private response?: ResponseModel;

  constructor(
    private readonly relativesInteractor: IPatientRelativesInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      const model = await this.relativesInteractor.relatives(session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class PatientRelativesControllerBuilder {
  static build(): PatientRelativesController {
    return new PatientRelativesController(
      PatientRelativesInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(PatientRelativesOutputDTOSchema),
    );
  }
}
