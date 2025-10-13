import { FastifyReply, FastifyRequest } from 'fastify';

import {
  CreateRelativeInformationBodyDTOSchema,
  CreateRelativeInformationInputDTO,
} from 'src/app/entities/dtos/input/createRelativeInformation.input.dto';
import { RelativeVerificationOutputDTOSchema } from 'src/app/entities/dtos/output/relativeVerification.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  CreateRelativeInformationInteractorBuilder,
  ICreateRelativeInformationInteractor,
} from 'src/app/interactors/createRelativeInformation/createRelativeInformation.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ICreateRelativeInformationController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class CreateRelativeInformationController implements ICreateRelativeInformationController {
  private response?: ResponseModel;

  constructor(
    private readonly createRelativeInformation: ICreateRelativeInformationInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<CreateRelativeInformationInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = CreateRelativeInformationBodyDTOSchema.parse(input.body);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.createRelativeInformation.create(body, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class CreateRelativeInformationControllerBuilder {
  static build(): CreateRelativeInformationController {
    return new CreateRelativeInformationController(
      CreateRelativeInformationInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(RelativeVerificationOutputDTOSchema),
    );
  }
}
