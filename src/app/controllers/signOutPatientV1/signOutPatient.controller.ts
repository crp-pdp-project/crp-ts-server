import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  ISignOutPatientInteractor,
  SignOutPatientInteractorBuilder,
} from 'src/app/interactors/signOutPatient/signOutPatient.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ISignOutPatientController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class SignOutPatientController implements ISignOutPatientController {
  private response?: ResponseModel;

  constructor(
    private readonly signOutInteractor: ISignOutPatientInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      await this.signOutInteractor.signOut(session);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class SignOutPatientControllerBuilder {
  static build(): SignOutPatientController {
    return new SignOutPatientController(SignOutPatientInteractorBuilder.build(), ResponseManagerBuilder.buildEmpty());
  }
}
