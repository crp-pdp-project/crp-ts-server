import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  DeleteBiometricPasswordInteractorBuilder,
  IDeleteBiometricPasswordInteractor,
} from 'src/app/interactors/deleteBiometricPassword/deleteBiometricPassword.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IDeleteBiometricPasswordController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class DeleteBiometricPasswordController implements IDeleteBiometricPasswordController {
  private response?: ResponseModel;

  constructor(
    private readonly deleteBiometricPassword: IDeleteBiometricPasswordInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      await this.deleteBiometricPassword.delete(session);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class DeleteBiometricPasswordControllerBuilder {
  static build(): DeleteBiometricPasswordController {
    return new DeleteBiometricPasswordController(
      DeleteBiometricPasswordInteractorBuilder.build(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
