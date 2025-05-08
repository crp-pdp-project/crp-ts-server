import { AppointmentTypeDTO } from '../dtos/service/appointmentType.dto';

import { AppointmentTypeModel } from './appointmentType.model';
import { BaseModel } from './base.model';

export class AppointmentTypeListModel extends BaseModel {
  readonly appointmentTypes?: AppointmentTypeModel[];

  constructor(appointmentTypesList: AppointmentTypeDTO[]) {
    super();

    this.appointmentTypes = this.generateAppointmentTypesList(appointmentTypesList);
  }

  private generateAppointmentTypesList(appointmentTypesList: AppointmentTypeDTO[]): AppointmentTypeModel[] {
    return appointmentTypesList.map((type) => new AppointmentTypeModel(type));
  }
}
