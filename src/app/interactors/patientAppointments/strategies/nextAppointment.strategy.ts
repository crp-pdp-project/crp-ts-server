import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentModel } from 'src/app/entities/models/appointment/appointment.model';
import { AppointmentListModel } from 'src/app/entities/models/appointment/appointmentsList.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { IGetCurrentAppointmentsRepository } from 'src/app/repositories/soap/getCurrentAppointments.repository';
import { AppointmentFilters } from 'src/general/enums/appointmentFilters.enum';
import { SortOrder } from 'src/general/enums/sort.enum';
import { ValidationRules } from 'src/general/enums/validationRules.enum';

import { IPatientAppointmentsStrategy } from '../patientAppointments.interactor';

export class NextAppointmentStrategy implements IPatientAppointmentsStrategy {
  constructor(private readonly getCurrentAppointments: IGetCurrentAppointmentsRepository) {}

  async fetchData(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<AppointmentModel | void> {
    session.validateFmpId(fmpId, ValidationRules.SELF_ONLY);
    const currentAppointments = await this.getCurrentAppointments.execute(fmpId, AppointmentFilters.VALID_ONLY);

    return new AppointmentListModel(currentAppointments, SortOrder.ASC).getFirstAppointment();
  }
}
