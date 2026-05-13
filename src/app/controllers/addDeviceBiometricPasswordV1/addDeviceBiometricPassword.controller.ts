import type { FastifyReply, FastifyRequest } from 'fastify';

import type { AddDeviceBiometricPasswordInputDTO } from 'src/app/entities/dtos/input/addDeviceBiometricPassword.input.dto';
import { AddDeviceBiometricPasswordBodyDTOSchema } from 'src/app/entities/dtos/input/addDeviceBiometricPassword.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import type { IAddDeviceBiometricPasswordInteractor } from 'src/app/interactors/addDeviceBiometricPassword/addDeviceBiometricPassword.interactor';
import { AddDeviceBiometricPasswordInteractorBuilder } from 'src/app/interactors/addDeviceBiometricPassword/addDeviceBiometricPassword.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import type { IResponseManager } from 'src/general/managers/response/response.manager';
import { ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

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
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
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
