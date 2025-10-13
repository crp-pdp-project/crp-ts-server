import { FastifyReply, FastifyRequest } from 'fastify';

import {
  CreateRelativeBodyDTOSchema,
  CreateRelativeInputDTO,
} from 'src/app/entities/dtos/input/createRelative.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  CreateRelativeInteractorBuilder,
  ICreateRelativeInteractor,
} from 'src/app/interactors/createRelative/createRelative.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ICreateRelativeController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class CreateRelativeController implements ICreateRelativeController {
  private response?: ResponseModel;

  constructor(
    private readonly createRelative: ICreateRelativeInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<CreateRelativeInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = CreateRelativeBodyDTOSchema.parse(input.body);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      await this.createRelative.create(body, session);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class CreateRelativeControllerBuilder {
  static build(): CreateRelativeController {
    return new CreateRelativeController(CreateRelativeInteractorBuilder.build(), ResponseManagerBuilder.buildEmpty());
  }
}
