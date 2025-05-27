import { SortOrder } from 'src/general/enums/sort.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

import { AppointmentDTO } from '../dtos/service/appointment.dto';

import { AppointmentModel } from './appointment.model';
import { BaseModel } from './base.model';

export class AppointmentListModel extends BaseModel {
  readonly appointments: AppointmentModel[];

  constructor(appointmentsList: AppointmentDTO[], sort?: SortOrder) {
    super();

    this.appointments = this.generateAppointmentsList(appointmentsList, sort);
  }

  private generateAppointmentsList(appointments: AppointmentDTO[], sort?: SortOrder): AppointmentModel[] {
    const sorted = sort ? this.sortAppointments([...appointments], sort) : appointments;
    return sorted.map((app) => new AppointmentModel(app));
  }

  private sortAppointments(list: AppointmentDTO[], sort: SortOrder): AppointmentDTO[] {
    return list.sort((a, b) => {
      const dateA = DateHelper.toDate(a.date ?? '');
      const dateB = DateHelper.toDate(b.date ?? '');

      return sort === SortOrder.ASC ? dateA.diff(dateB) : dateB.diff(dateA);
    });
  }

  getFirstAppointment(): AppointmentModel | void {
    const firstAppointment = this.appointments?.[0];
    if (firstAppointment) return firstAppointment;
  }
}
