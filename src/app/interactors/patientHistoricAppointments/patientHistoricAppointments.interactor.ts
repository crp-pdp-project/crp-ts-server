import { FastifyRequest } from 'fastify';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import {
  PatientHistoricAppointmentsInputDTO,
  PatientHistoricAppointmentsQueryDTO,
  PatientHistoricAppointmentsQueryDTOSchema,
} from 'src/app/entities/dtos/input/patientHistoricAppointments.input.dto';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment.mpdel';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IGetHistoricAppointmentsRepository } from 'src/app/repositories/soap/getHistoricAppointments.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface IPatientHistoricAppointmentsInteractor {
  appointments(input: FastifyRequest<PatientHistoricAppointmentsInputDTO>): Promise<AppointmentModel[] | ErrorModel>;
}

export class PatientHistoricAppointmentsInteractor implements IPatientHistoricAppointmentsInteractor {
  constructor(private readonly getHistoricAppointments: IGetHistoricAppointmentsRepository) {}

  async appointments(
    input: FastifyRequest<PatientHistoricAppointmentsInputDTO>,
  ): Promise<AppointmentModel[] | ErrorModel> {
    try {
      const monthsToList = this.validateInput(input.query);
      const fmpId = this.validateSession(input.session);
      const currentAppointments = await this.getAppointments(fmpId, monthsToList);
      return this.generateModels(currentAppointments);
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

  private generateModels(appointments: AppointmentDTO[]): AppointmentModel[] {
    const models = appointments.map((appointment) => new AppointmentModel(appointment));
    return models;
  }
}
