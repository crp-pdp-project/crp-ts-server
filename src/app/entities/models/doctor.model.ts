import { TextHelper } from 'src/general/helpers/text.helper';

import { DoctorDTO } from '../dtos/service/doctor.dto';

import { BaseModel } from './base.model';

export class DoctorModel extends BaseModel {
  readonly id?: string;
  readonly name?: string;
  readonly profileImage?: string | null;

  constructor(doctor: DoctorDTO, imageMeta?: DoctorDTO[]) {
    super();

    this.id = doctor.id;
    this.name = TextHelper.titleCase(doctor.name);
    this.profileImage = imageMeta ? this.resolveProfileImage(doctor.id, imageMeta) : undefined;
  }

  private resolveProfileImage(id?: DoctorDTO['id'], imageMeta?: DoctorDTO[]): string | null {
    return imageMeta?.find((meta) => meta.id === id)?.profileImage ?? null;
  }
}
