import { FastifyReply, FastifyRequest } from 'fastify';

import {
  AddDeviceBiometricPasswordBodyDTOSchema,
  AddDeviceBiometricPasswordInputDTO,
} from 'src/app/entities/dtos/input/addDeviceBiometricPassword.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  AddDeviceBiometricPasswordInteractorBuilder,
  IAddDeviceBiometricPasswordInteractor,
} from 'src/app/interactors/addDeviceBiometricPassword/addDeviceBiometricPassword.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IAddDeviceBiometricPasswordController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class AddDeviceBiometricPasswordController implements IAddDeviceBiometricPasswordController {
  private response?: ResponseModel;

  constructor(
    private readonly addDeviceBiometricPassword: IAddDeviceBiometricPasswordInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<AddDeviceBiometricPasswordInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = AddDeviceBiometricPasswordBodyDTOSchema.parse(input.body);
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      await this.addDeviceBiometricPassword.add(body, session);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class AddDeviceBiometricPasswordControllerBuilder {
  static build(): AddDeviceBiometricPasswordController {
    return new AddDeviceBiometricPasswordController(
      AddDeviceBiometricPasswordInteractorBuilder.build(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
