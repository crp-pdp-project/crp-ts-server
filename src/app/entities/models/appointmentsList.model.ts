import dayjs from 'dayjs';

import { SortOrder } from 'src/general/enums/sort.enum';

import { AppointmentDTO } from '../dtos/service/appointment.dto';

import { AppointmentModel } from './appointment.model';
import { BaseModel } from './base.model';

export class AppointmentListModel extends BaseModel {
  readonly appointments?: AppointmentModel[];

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
      const dateA = dayjs(a.date ?? '');
      const dateB = dayjs(b.date ?? '');

      if (!dateA.isValid()) return 1;
      if (!dateB.isValid()) return -1;

      return sort === SortOrder.ASC ? dateA.valueOf() - dateB.valueOf() : dateB.valueOf() - dateA.valueOf();
    });
  }
}
