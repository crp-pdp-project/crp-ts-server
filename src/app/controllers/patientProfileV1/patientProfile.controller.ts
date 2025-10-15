import { FastifyReply, FastifyRequest } from 'fastify';

import { PatientProfileOutputDTOSchema } from 'src/app/entities/dtos/output/patientProfile.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  IPatientProfileInteractor,
  PatientProfileInteractorBuilder,
} from 'src/app/interactors/patientProfile/patientProfile.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPatientProfileController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientProfileController implements IPatientProfileController {
  private response?: ResponseModel;

  constructor(
    private readonly profileInteractor: IPatientProfileInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.profileInteractor.profile(session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class PatientProfileControllerBuilder {
  static build(): PatientProfileController {
    return new PatientProfileController(
      PatientProfileInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(PatientProfileOutputDTOSchema),
    );
  }
}
