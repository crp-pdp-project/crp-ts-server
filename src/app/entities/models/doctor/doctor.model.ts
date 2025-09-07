import { DoctorDTO } from 'src/app/entities/dtos/service/doctor.dto';
import { TextHelper } from 'src/general/helpers/text.helper';

import { BaseModel } from '../base.model';
import { SpecialtyModel } from '../specialty/specialty.model';

export class DoctorModel extends BaseModel {
  readonly id?: string;
  readonly name?: string;
  readonly profileImage?: string | null;
  readonly specialty?: SpecialtyModel;

  constructor(doctor: DoctorDTO) {
    super();

    this.id = doctor.id;
    this.name = TextHelper.titleCase(doctor.name);
    this.profileImage = doctor.profileImage;
    this.specialty = doctor.specialty ? new SpecialtyModel(doctor.specialty) : undefined;
  }
}
