import { FastifyReply, FastifyRequest } from 'fastify';

import {
  DeleteRelativeInputDTO,
  DeleteRelativeParamsDTOSchema,
} from 'src/app/entities/dtos/input/deleteRelative.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  DeleteRelativeInteractorBuilder,
  IDeleteRelativeInteractor,
} from 'src/app/interactors/deleteRelative/deleteRelative.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IDeleteRelativeController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class DeleteRelativeController implements IDeleteRelativeController {
  private response?: ResponseModel;

  constructor(
    private readonly deleteRelative: IDeleteRelativeInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<DeleteRelativeInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = DeleteRelativeParamsDTOSchema.parse(input.params);
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      await this.deleteRelative.delete(params, session);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class DeleteRelativeControllerBuilder {
  static build(): DeleteRelativeController {
    return new DeleteRelativeController(DeleteRelativeInteractorBuilder.build(), ResponseManagerBuilder.buildEmpty());
  }
}
