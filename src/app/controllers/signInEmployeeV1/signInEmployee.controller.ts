import type { FastifyReply, FastifyRequest } from 'fastify';

import type { SignInEmployeeInputDTO } from 'src/app/entities/dtos/input/signInEmployee.input.dto';
import { SignInEmployeeBodyDTOSchema } from 'src/app/entities/dtos/input/signInEmployee.input.dto';
import { SignInEmployeeOutputDTOSchema } from 'src/app/entities/dtos/output/signInEmployee.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { ResponseModel } from 'src/app/entities/models/response/response.model';
import type { ISignInEmployeeInteractor } from 'src/app/interactors/signInEmployee/signInEmployee.interactor';
import { SignInEmployeeInteractorBuilder } from 'src/app/interactors/signInEmployee/signInEmployee.interactor';
import type { IResponseManager } from 'src/general/managers/response/response.manager';
import { ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ISignInEmployeeController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class SignInEmployeeController implements ISignInEmployeeController {
  private response?: ResponseModel;

  constructor(
    private readonly signInInteractor: ISignInEmployeeInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<SignInEmployeeInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = SignInEmployeeBodyDTOSchema.parse(input.body);
      const patient = await this.signInInteractor.signIn(body);
      this.response = this.responseManager.validateResponse(patient);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class SignInEmployeeControllerBuilder {
  static build(): SignInEmployeeController {
    return new SignInEmployeeController(
      SignInEmployeeInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(SignInEmployeeOutputDTOSchema),
    );
  }
}
