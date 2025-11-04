import { FastifyReply, FastifyRequest } from 'fastify';

import {
  PatientVerificationBodyDTOSchema,
  PatientVerificationInputDTO,
} from 'src/app/entities/dtos/input/patientVerification.input.dto';
import { PatientProfileOutputDTOSchema } from 'src/app/entities/dtos/output/patientProfile.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  IRelativeVerificationInteractor,
  RelativeVerificationInteractorBuilder,
} from 'src/app/interactors/relativeVerification/relativeVefirication.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IRelativeVerificationController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class RelativeVerificationController implements IRelativeVerificationController {
  private response?: ResponseModel;

  constructor(
    private readonly relativeVerification: IRelativeVerificationInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<PatientVerificationInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = PatientVerificationBodyDTOSchema.parse(input.body);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.relativeVerification.verify(body, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class RelativeVerificationControllerBuilder {
  static build(): RelativeVerificationController {
    return new RelativeVerificationController(
      RelativeVerificationInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(PatientProfileOutputDTOSchema),
    );
  }
}
