import { FastifyReply, FastifyRequest } from 'fastify';

import {
  PatientAppointmentsInputDTO,
  PatientAppointmentsParamsDTOSchema,
} from 'src/app/entities/dtos/input/patientAppointment.input.dto';
import { PatientAppointmentItemOutputDTOSchema } from 'src/app/entities/dtos/output/patientAppointmentItem.output.dto';
import { PatientAppointmentListOutputDTOSchema } from 'src/app/entities/dtos/output/patientHistoricAppointment.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  IPatientAppointmentsInteractor,
  PatientAppointmentsInteractorBuilder,
} from 'src/app/interactors/patientAppointments/patientAppointments.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPatientApointmentsController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientApointmentsController implements IPatientApointmentsController {
  private response?: ResponseModel;

  constructor(
    private readonly patientAppointmentsInteractor: IPatientAppointmentsInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<PatientAppointmentsInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = PatientAppointmentsParamsDTOSchema.parse(input.params);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.patientAppointmentsInteractor.getAppointmentInfo(params, session);
      this.response = this.responseManager.validateResponse(model ?? undefined);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class PatientApointmentsControllerBuilder {
  static buildNext(): PatientApointmentsController {
    return new PatientApointmentsController(
      PatientAppointmentsInteractorBuilder.buildNext(),
      ResponseManagerBuilder.buildMixed(PatientAppointmentItemOutputDTOSchema),
    );
  }

  static buildCurrent(): PatientApointmentsController {
    return new PatientApointmentsController(
      PatientAppointmentsInteractorBuilder.buildCurrent(),
      ResponseManagerBuilder.buildData(PatientAppointmentListOutputDTOSchema),
    );
  }

  static buildHistoric(): PatientApointmentsController {
    return new PatientApointmentsController(
      PatientAppointmentsInteractorBuilder.buildHistoric(),
      ResponseManagerBuilder.buildData(PatientAppointmentListOutputDTOSchema),
    );
  }
}
