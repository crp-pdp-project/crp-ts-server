import { FastifyRequest } from 'fastify';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import {
  PatientCurrentAppointmentsInputDTO,
  PatientCurrentAppointmentsParamsDTO,
  PatientCurrentAppointmentsParamsDTOSchema,
} from 'src/app/entities/dtos/input/patientCurrentAppointment.input.dto';
import {
  PatientNextAppointmentInputDTO,
  PatientNextAppointmentParamsDTO,
  PatientNextAppointmentParamsDTOSchema,
} from 'src/app/entities/dtos/input/patientNextAppointment.input.dto';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment.model';
import { AppointmentListModel } from 'src/app/entities/models/appointmentsList.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { IPatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { IGetCurrentAppointmentsRepository } from 'src/app/repositories/soap/getCurrentAppointments.repository';
import { AppointmentFilters } from 'src/general/enums/appointmentFilters.enum';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { SortOrder } from 'src/general/enums/sort.enum';
import { ValidationRules } from 'src/general/enums/validationRules.enum';

export interface IPatientCurrentAppointmentsInteractor {
  appointments(input: FastifyRequest<PatientCurrentAppointmentsInputDTO>): Promise<AppointmentListModel | ErrorModel>;
  appointment(input: FastifyRequest<PatientNextAppointmentInputDTO>): Promise<AppointmentModel | ErrorModel | void>;
}

export class PatientCurrentAppointmentsInteractor implements IPatientCurrentAppointmentsInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly getCurrentAppointments: IGetCurrentAppointmentsRepository,
  ) {}

  async appointments(
    input: FastifyRequest<PatientCurrentAppointmentsInputDTO>,
  ): Promise<AppointmentListModel | ErrorModel> {
    try {
      const { fmpId } = this.validateInputCurrent(input.params);
      const session = this.validateSession(input.session);
      const relatives = await this.getPatientRelatives(session.patient.id);
      session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_ONLY);
      const currentAppointments = await this.fetchAppointments(fmpId, AppointmentFilters.All);
      return new AppointmentListModel(currentAppointments, SortOrder.ASC);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  async appointment(
    input: FastifyRequest<PatientNextAppointmentInputDTO>,
  ): Promise<AppointmentModel | ErrorModel | void> {
    try {
      const { fmpId } = this.validateInputNext(input.params);
      const session = this.validateSession(input.session);
      const relatives = await this.getPatientRelatives(session.patient.id);
      session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_ONLY);
      const currentAppointments = await this.fetchAppointments(fmpId, AppointmentFilters.VALID_ONLY);
      const listModel = new AppointmentListModel(currentAppointments, SortOrder.ASC);
      return listModel.getFirstAppointment();
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateInputCurrent(params: PatientCurrentAppointmentsParamsDTO): PatientCurrentAppointmentsParamsDTO {
    return PatientCurrentAppointmentsParamsDTOSchema.parse(params);
  }

  private validateInputNext(params: PatientNextAppointmentParamsDTO): PatientNextAppointmentParamsDTO {
    return PatientNextAppointmentParamsDTOSchema.parse(params);
  }

  private validateSession(session?: SessionModel): SignInSessionModel {
    if (!(session instanceof SignInSessionModel)) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session;
  }

  private async getPatientRelatives(id: PatientDM['id']): Promise<PatientDTO[]> {
    const relatives = await this.patientRelativesValidation.execute(id);

    return relatives;
  }

  private async fetchAppointments(fmpId: PatientDM['fmpId'], filter: AppointmentFilters): Promise<AppointmentDTO[]> {
    const searchResult = await this.getCurrentAppointments.execute(fmpId, filter);

    return searchResult;
  }
}
