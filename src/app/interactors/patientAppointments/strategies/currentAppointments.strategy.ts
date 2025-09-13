import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentListModel } from 'src/app/entities/models/appointment/appointmentsList.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import { IGetCurrentAppointmentsRepository } from 'src/app/repositories/soap/getCurrentAppointments.repository';
import { AppointmentFilters } from 'src/general/enums/appointmentFilters.enum';
import { SortOrder } from 'src/general/enums/sort.enum';

import { IPatientAppointmentsStrategy } from '../patientAppointments.interactor';

export class CurrentAppointmentsStrategy implements IPatientAppointmentsStrategy {
  constructor(private readonly getCurrentAppointments: IGetCurrentAppointmentsRepository) {}

  async fetchData(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<AppointmentListModel> {
    session.validateFmpId(fmpId, ValidationRules.SELF_ONLY);
    const currentAppointments = await this.getCurrentAppointments.execute(fmpId, AppointmentFilters.All);

    return new AppointmentListModel(currentAppointments, SortOrder.ASC);
  }
}
