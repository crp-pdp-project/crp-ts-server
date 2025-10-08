import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentModel } from 'src/app/entities/models/appointment/appointment.model';
import { AppointmentListModel } from 'src/app/entities/models/appointment/appointmentsList.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import { IGetAppointmentsRepository } from 'src/app/repositories/soap/getAppointments.repository';
import { AppointmentFilters } from 'src/general/enums/appointmentFilters.enum';
import { SortOrder } from 'src/general/enums/sort.enum';

import { IPatientAppointmentsStrategy } from '../patientAppointments.interactor';

export class NextAppointmentStrategy implements IPatientAppointmentsStrategy {
  constructor(private readonly getAppointments: IGetAppointmentsRepository) {}

  async fetchData(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<AppointmentModel | void> {
    session.validateFmpId(fmpId, ValidationRules.SELF_OR_VERIFIED);
    const currentAppointments = await this.getAppointments.execute(fmpId, AppointmentFilters.VALID_ONLY);

    return new AppointmentListModel(currentAppointments, SortOrder.ASC).getFirstAppointment();
  }
}
