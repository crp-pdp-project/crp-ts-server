import { FastifyReply, FastifyRequest } from 'fastify';

import {
  PatientVerificationBodyDTOSchema,
  PatientVerificationInputDTO,
} from 'src/app/entities/dtos/input/patientVerification.input.dto';
import { PatientVerificationOutputDTOSchema } from 'src/app/entities/dtos/output/patientVerification.output.dto';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  IPatientVerificationInteractor,
  PatientVerificationInteractorBuilder,
} from 'src/app/interactors/patientVerification/patientVerification.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPatientVerificationController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientVerificationController implements IPatientVerificationController {
  private response?: ResponseModel;

  constructor(
    private readonly verificationInteractor: IPatientVerificationInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<PatientVerificationInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = PatientVerificationBodyDTOSchema.parse(input.body);
      const device = DeviceModel.extractDevice(input.device);
      const model = await this.verificationInteractor.verify(body, device);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class PatientVerificationControllerBuilder {
  static buildEnroll(): PatientVerificationController {
    return new PatientVerificationController(
      PatientVerificationInteractorBuilder.buildEnroll(),
      ResponseManagerBuilder.buildData(PatientVerificationOutputDTOSchema),
    );
  }

  static buildRecover(): PatientVerificationController {
    return new PatientVerificationController(
      PatientVerificationInteractorBuilder.buildRecover(),
      ResponseManagerBuilder.buildData(PatientVerificationOutputDTOSchema),
    );
  }
}
