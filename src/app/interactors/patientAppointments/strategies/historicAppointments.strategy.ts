import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentListModel } from 'src/app/entities/models/appointment/appointmentsList.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { IGetHistoricAppointmentsRepository } from 'src/app/repositories/soap/getHistoricAppointments.repository';
import { SortOrder } from 'src/general/enums/sort.enum';
import { ValidationRules } from 'src/general/enums/validationRules.enum';

import { IPatientAppointmentsStrategy } from '../patientAppointments.interactor';

export class HistoryAppointmentsStrategy implements IPatientAppointmentsStrategy {
  constructor(private readonly getHistoricAppointments: IGetHistoricAppointmentsRepository) {}

  async fetchData(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<AppointmentListModel> {
    session.validateFmpId(fmpId, ValidationRules.SELF_ONLY);
    const currentAppointments = await this.getHistoricAppointments.execute(fmpId);

    return new AppointmentListModel(currentAppointments, SortOrder.DESC);
  }
}
