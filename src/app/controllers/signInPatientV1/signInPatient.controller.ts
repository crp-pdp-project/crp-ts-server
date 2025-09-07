import { FastifyReply, FastifyRequest } from 'fastify';

import { SignInPatientBodyDTOSchema, SignInPatientInputDTO } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { SignInPatientOutputDTOSchema } from 'src/app/entities/dtos/output/signInPatient.output.dto';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  ISignInPatientInteractor,
  SignInPatientInteractorBuilder,
} from 'src/app/interactors/signInPatient/signInPatient.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ISignInPatientController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class SignInPatientController implements ISignInPatientController {
  private response?: ResponseModel;

  constructor(
    private readonly signInInteractor: ISignInPatientInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<SignInPatientInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = SignInPatientBodyDTOSchema.parse(input.body);
      const device = DeviceModel.extractDevice(input.device);
      const patient = await this.signInInteractor.signIn(body, device);
      this.response = this.responseManager.validateResponse(patient);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class SignInPatientControllerBuilder {
  static buildRegular(): SignInPatientController {
    return new SignInPatientController(
      SignInPatientInteractorBuilder.buildRegular(),
      ResponseManagerBuilder.buildData(SignInPatientOutputDTOSchema),
    );
  }

  static buildBiometric(): SignInPatientController {
    return new SignInPatientController(
      SignInPatientInteractorBuilder.buildBiometric(),
      ResponseManagerBuilder.buildData(SignInPatientOutputDTOSchema),
    );
  }
}
