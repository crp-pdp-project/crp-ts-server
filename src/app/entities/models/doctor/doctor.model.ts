import type { DoctorDTO } from 'src/app/entities/dtos/service/doctor.dto';
import { AvailabilityFilters } from 'src/general/enums/availabilityFilters.enum';
import { TextHelper } from 'src/general/helpers/text.helper';

import { AvailabilityListModel } from '../availability/availabilityList.model';
import { BaseModel } from '../base.model';
import { SpecialtyModel } from '../specialty/specialty.model';

export class DoctorModel extends BaseModel {
  readonly id?: string;
  readonly name?: string;
  readonly profileImage?: string | null;
  readonly specialty?: SpecialtyModel;
  readonly availability?: AvailabilityListModel['availability'];

  constructor(doctor: DoctorDTO) {
    super();

    this.id = doctor.id;
    this.name = TextHelper.titleCase(doctor.name);
    this.profileImage = doctor.profileImage;
    this.specialty = doctor.specialty ? new SpecialtyModel(doctor.specialty) : undefined;
    this.availability = doctor.availability
      ? new AvailabilityListModel(doctor.availability, AvailabilityFilters.ALL).availability
      : undefined;
  }
}
