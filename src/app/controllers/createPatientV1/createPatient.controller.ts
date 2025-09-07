import { FastifyReply, FastifyRequest } from 'fastify';

import { CreatePatientBodyDTOSchema, CreatePatientInputDTO } from 'src/app/entities/dtos/input/createPatient.input.dto';
import { PatientVerificationOutputDTOSchema } from 'src/app/entities/dtos/output/patientVerification.output.dto';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  CreatePatientInteractorBuilder,
  ICreatePatientInteractor,
} from 'src/app/interactors/createPatient/createPatient.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ICreatePatientController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class CreatePatientController implements ICreatePatientController {
  private response?: ResponseModel;

  constructor(
    private readonly createPatient: ICreatePatientInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<CreatePatientInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = CreatePatientBodyDTOSchema.parse(input.body);
      const device = DeviceModel.extractDevice(input.device);
      const model = await this.createPatient.create(body, device);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class CreatePatientControllerBuilder {
  static build(): CreatePatientController {
    return new CreatePatientController(
      CreatePatientInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(PatientVerificationOutputDTOSchema),
    );
  }
}
