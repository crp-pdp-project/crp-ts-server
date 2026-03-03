import type { FastifyReply, FastifyRequest } from 'fastify';

import type { PatientAppointmentDetailInputDTO } from 'src/app/entities/dtos/input/patientAppointmentDetail.input.dto';
import { PatientAppointmentDetailParamsDTOSchema } from 'src/app/entities/dtos/input/patientAppointmentDetail.input.dto';
import { PatientAppointmentDetailOutputDTOSchema } from 'src/app/entities/dtos/output/patientAppointmentDetail.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import type { IPatientAppointmentDetailInteractor } from 'src/app/interactors/patientAppointmentDetail/patientAppointmentDetail.interactor';
import { PatientAppointmentDetailInteractorBuilder } from 'src/app/interactors/patientAppointmentDetail/patientAppointmentDetail.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import type { IResponseManager } from 'src/general/managers/response/response.manager';
import { ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPatientAppointmentDetailController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientAppointmentDetailController implements IPatientAppointmentDetailController {
  private response?: ResponseModel;

  constructor(
    private readonly appointmentDetail: IPatientAppointmentDetailInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<PatientAppointmentDetailInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = PatientAppointmentDetailParamsDTOSchema.parse(input.params);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.appointmentDetail.obtain(params, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class PatientAppointmentDetailControllerBuilder {
  static build(): PatientAppointmentDetailController {
    return new PatientAppointmentDetailController(
      PatientAppointmentDetailInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(PatientAppointmentDetailOutputDTOSchema),
    );
  }
}
