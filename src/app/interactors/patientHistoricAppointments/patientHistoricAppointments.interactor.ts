import { FastifyRequest } from 'fastify';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import {
  PatientHistoricAppointmentsInputDTO,
  PatientHistoricAppointmentsParamsDTO,
  PatientHistoricAppointmentsParamsDTOSchema,
} from 'src/app/entities/dtos/input/patientHistoricAppointment.input.dto';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { AppointmentListModel } from 'src/app/entities/models/appointmentsList.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { IPatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { IGetHistoricAppointmentsRepository } from 'src/app/repositories/soap/getHistoricAppointments.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { SortOrder } from 'src/general/enums/sort.enum';

export interface IPatientHistoricAppointmentsInteractor {
  appointments(input: FastifyRequest<PatientHistoricAppointmentsInputDTO>): Promise<AppointmentListModel | ErrorModel>;
}

export class PatientHistoricAppointmentsInteractor implements IPatientHistoricAppointmentsInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly getHistoricAppointments: IGetHistoricAppointmentsRepository,
  ) {}

  async appointments(
    input: FastifyRequest<PatientHistoricAppointmentsInputDTO>,
  ): Promise<AppointmentListModel | ErrorModel> {
    try {
      const { fmpId } = this.validateInput(input.params);
      const session = this.validateSession(input.session);
      const relatives = await this.getPatientRelatives(session.patient.id);
      this.validatePatientId(fmpId, session, relatives);
      const currentAppointments = await this.getAppointments(fmpId);
      return new AppointmentListModel(currentAppointments, SortOrder.DESC);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateInput(params: PatientHistoricAppointmentsParamsDTO): PatientHistoricAppointmentsParamsDTO {
    return PatientHistoricAppointmentsParamsDTOSchema.parse(params);
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

  private validatePatientId(fmpId: PatientDM['fmpId'], session: SignInSessionModel, relatives: PatientDTO[]): void {
    const isSelf = session.patient.fmpId === fmpId;
    const isRelative = relatives.some((relative) => relative.fmpId === fmpId);

    if (!isSelf && !isRelative) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.ID_NOT_VALID });
    }
  }

  private async getAppointments(fmpId: PatientDM['fmpId']): Promise<AppointmentDTO[]> {
    const searchResult = await this.getHistoricAppointments.execute(fmpId);

    return searchResult;
  }
}
