import { FastifyRequest } from 'fastify';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import {
  CreateAppointmentBodyDTO,
  CreateAppointmentBodyDTOSchema,
  CreateAppointmentInputDTO,
  CreateAppointmentParamsDTO,
  CreateAppointmentParamsDTOSchema,
} from 'src/app/entities/dtos/input/createAppointment.input.dto';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import {
  AppointmentRequestDTO,
  AppointmentRequestDTOSchema,
} from 'src/app/entities/dtos/service/appointmentRequest.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { IPatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { IGetCurrentAppointmentsRepository } from 'src/app/repositories/soap/getCurrentAppointments.repository';
import { ISaveAppointmentRepository } from 'src/app/repositories/soap/saveAppointment.repository';
import { AppointmentFilters } from 'src/general/enums/appointmentFilters.enum';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { ValidationRules } from 'src/general/enums/validationRules.enum';

export interface ICreateAppointmentInteractor {
  create(input: FastifyRequest<CreateAppointmentInputDTO>): Promise<AppointmentModel | ErrorModel>;
}

export class CreateAppointmentInteractor implements ICreateAppointmentInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly saveAppointment: ISaveAppointmentRepository,
    private readonly currentAppointments: IGetCurrentAppointmentsRepository,
  ) {}

  async create(input: FastifyRequest<CreateAppointmentInputDTO>): Promise<AppointmentModel | ErrorModel> {
    try {
      const body = this.validateBody(input.body);
      const { fmpId } = this.validateParams(input.params);
      const session = this.validateSession(input.session);
      const relatives = await this.getPatientRelatives(session.patient.id);
      session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_RELATIVES);
      const payload = this.genPayload(fmpId, body);
      const appointmentId = await this.createAppointment(payload);
      const appointment = await this.getNewAppointment(fmpId, appointmentId, body.date);
      return new AppointmentModel(appointment);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateBody(body: CreateAppointmentBodyDTO): CreateAppointmentBodyDTO {
    return CreateAppointmentBodyDTOSchema.parse(body);
  }

  private validateParams(params: CreateAppointmentParamsDTO): CreateAppointmentParamsDTO {
    return CreateAppointmentParamsDTOSchema.parse(params);
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

  private genPayload(fmpId: PatientDM['fmpId'], body: CreateAppointmentBodyDTO): AppointmentRequestDTO {
    const payload = AppointmentRequestDTOSchema.parse({ fmpId, ...body });

    return payload;
  }

  private async createAppointment(payload: AppointmentRequestDTO): Promise<string> {
    const newAppointment = await this.saveAppointment.execute(payload);
    if (newAppointment.errorCode === -1) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.APPOINTMENT_REPEATED });
    }
    if (!newAppointment.id) {
      throw ErrorModel.server({ message: 'Error creating the appointment, no Id received' });
    }

    return newAppointment.id;
  }

  private async getNewAppointment(
    fmpId: PatientDM['fmpId'],
    appointmentId: string,
    appointmentDate: string,
  ): Promise<AppointmentDTO> {
    const appointmentList = await this.currentAppointments.execute(fmpId, AppointmentFilters.VALID_ONLY, appointmentDate).catch(() => []);
    const newAppointment = appointmentList.find((appointment) => appointment.id?.includes(appointmentId));

    return newAppointment ?? ({ id: appointmentId } as AppointmentDTO);
  }
}
