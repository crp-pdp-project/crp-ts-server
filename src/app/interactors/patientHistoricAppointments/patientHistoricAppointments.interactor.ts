import { FastifyRequest } from 'fastify';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import {
  PatientHistoricAppointmentsInputDTO,
  PatientHistoricAppointmentsQueryDTO,
  PatientHistoricAppointmentsQueryDTOSchema,
} from 'src/app/entities/dtos/input/patientHistoricAppointments.input.dto';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { AppointmentListModel } from 'src/app/entities/models/appointmentsList.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IGetHistoricAppointmentsRepository } from 'src/app/repositories/soap/getHistoricAppointments.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';
import { SortOrder } from 'src/general/enums/sort.enum';

export interface IPatientHistoricAppointmentsInteractor {
  appointments(input: FastifyRequest<PatientHistoricAppointmentsInputDTO>): Promise<AppointmentListModel | ErrorModel>;
}

export class PatientHistoricAppointmentsInteractor implements IPatientHistoricAppointmentsInteractor {
  constructor(private readonly getHistoricAppointments: IGetHistoricAppointmentsRepository) {}

  async appointments(
    input: FastifyRequest<PatientHistoricAppointmentsInputDTO>,
  ): Promise<AppointmentListModel | ErrorModel> {
    try {
      const monthsToList = this.validateInput(input.query);
      const fmpId = this.validateSession(input.session);
      const currentAppointments = await this.getAppointments(fmpId, monthsToList);
      return new AppointmentListModel(currentAppointments, SortOrder.DESC);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateInput(query?: PatientHistoricAppointmentsQueryDTO): number {
    const { monthsToList } = PatientHistoricAppointmentsQueryDTOSchema.parse(query);

    return monthsToList;
  }

  private validateSession(session?: SessionModel): PatientDM['fmpId'] {
    if (!session || !session?.patient?.fmpId) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    return session.patient.fmpId;
  }

  private async getAppointments(fmpId: PatientDM['fmpId'], monthsToList: number): Promise<AppointmentDTO[]> {
    const searchResult = await this.getHistoricAppointments.execute(fmpId, monthsToList);

    return searchResult;
  }
}
