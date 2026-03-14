import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentListModel } from 'src/app/entities/models/appointment/appointmentsList.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import type { IGetAppointmentsRepository } from 'src/app/repositories/soap/getAppointments.repository';
import { GetAppointmentsRepository } from 'src/app/repositories/soap/getAppointments.repository';
import { AppointmentFilters } from 'src/general/enums/appointmentFilters.enum';
import { SortOrder } from 'src/general/enums/sort.enum';

import type { IPatientAppointmentsStrategy } from '../patientAppointments.interactor';

export class CurrentAppointmentsStrategy implements IPatientAppointmentsStrategy {
  constructor(private readonly getAppointments: IGetAppointmentsRepository) {}

  async fetchData(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<AppointmentListModel> {
    session.validateFmpId(fmpId, ValidationRules.SELF_OR_VERIFIED);
    const currentAppointments = await this.getAppointments.execute(fmpId, AppointmentFilters.ALL);

    return new AppointmentListModel(currentAppointments, SortOrder.ASC);
  }
}

export class CurrentAppointmentsStrategyBuilder {
  static build(): CurrentAppointmentsStrategy {
    return new CurrentAppointmentsStrategy(new GetAppointmentsRepository());
  }
}
