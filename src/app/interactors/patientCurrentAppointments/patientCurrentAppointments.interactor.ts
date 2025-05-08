import { FastifyRequest } from 'fastify';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { AppointmentListModel } from 'src/app/entities/models/appointmentsList.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IGetCurrentAppointmentsRepository } from 'src/app/repositories/soap/getCurrentAppointments.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';
import { SortOrder } from 'src/general/enums/sort.enum';

export interface IPatientCurrentAppointmentsInteractor {
  appointments(input: FastifyRequest): Promise<AppointmentListModel | ErrorModel>;
}

export class PatientCurrentAppointmentsInteractor implements IPatientCurrentAppointmentsInteractor {
  constructor(private readonly getCurrentAppointments: IGetCurrentAppointmentsRepository) {}

  async appointments(input: FastifyRequest): Promise<AppointmentListModel | ErrorModel> {
    try {
      const fmpId = this.validateSession(input.session);
      const currentAppointments = await this.getAppointments(fmpId);
      return new AppointmentListModel(currentAppointments, SortOrder.ASC);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): PatientDM['fmpId'] {
    if (!session || !session?.patient?.fmpId) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    return session.patient.fmpId;
  }

  private async getAppointments(fmpId: PatientDM['fmpId']): Promise<AppointmentDTO[]> {
    const searchResult = await this.getCurrentAppointments.execute(fmpId);

    return searchResult;
  }
}
