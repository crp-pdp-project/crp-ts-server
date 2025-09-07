import { AppointmentTypeDTO } from 'src/app/entities/dtos/service/appointmentType.dto';

import { BaseModel } from '../base.model';

import { AppointmentTypeModel } from './appointmentType.model';

export class AppointmentTypeListModel extends BaseModel {
  readonly appointmentTypes: AppointmentTypeModel[];

  constructor(appointmentTypesList: AppointmentTypeDTO[]) {
    super();

    this.appointmentTypes = this.generateAppointmentTypesList(appointmentTypesList);
  }

  private generateAppointmentTypesList(appointmentTypesList: AppointmentTypeDTO[]): AppointmentTypeModel[] {
    return appointmentTypesList.map((type) => new AppointmentTypeModel(type));
  }
}
