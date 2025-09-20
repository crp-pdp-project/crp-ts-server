import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  DeletePatientAccountInteractorBuilder,
  IDeletePatientAccountInteractor,
} from 'src/app/interactors/deletePatientAccount/deletePatientAccount.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IDeletePatientAccountController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class DeletePatientAccountController implements IDeletePatientAccountController {
  private response?: ResponseModel;

  constructor(
    private readonly deletePatientAccount: IDeletePatientAccountInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      await this.deletePatientAccount.delete(session);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class DeletePatientAccountControllerBuilder {
  static build(): DeletePatientAccountController {
    return new DeletePatientAccountController(
      DeletePatientAccountInteractorBuilder.build(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
