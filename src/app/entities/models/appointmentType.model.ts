import { TextHelper } from 'src/general/helpers/text.helper';

import { AppointmentTypeDTO } from '../dtos/service/appointmentType.dto';

import { BaseModel } from './base.model';

export class AppointmentTypeModel extends BaseModel {
  readonly id?: string;
  readonly name?: string;

  constructor(appointmentType: AppointmentTypeDTO) {
    super();

    this.id = appointmentType.id;
    this.name = TextHelper.titleCase(appointmentType.name);
  }
}
