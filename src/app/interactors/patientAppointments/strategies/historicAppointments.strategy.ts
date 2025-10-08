import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentListModel } from 'src/app/entities/models/appointment/appointmentsList.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import { IGetAppointmentsRepository } from 'src/app/repositories/soap/getAppointments.repository';
import { AppointmentFilters } from 'src/general/enums/appointmentFilters.enum';
import { SortOrder } from 'src/general/enums/sort.enum';

import { IPatientAppointmentsStrategy } from '../patientAppointments.interactor';

export class HistoryAppointmentsStrategy implements IPatientAppointmentsStrategy {
  constructor(private readonly getAppointments: IGetAppointmentsRepository) {}

  async fetchData(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<AppointmentListModel> {
    session.validateFmpId(fmpId, ValidationRules.SELF_OR_VERIFIED);
    const currentAppointments = await this.getAppointments.execute(fmpId, AppointmentFilters.CLOSED_ONY);

    return new AppointmentListModel(currentAppointments, SortOrder.DESC);
  }
}
