import { DoctorDTO } from '../dtos/service/doctor.dto';

import { BaseModel } from './base.model';
import { DoctorModel } from './doctor.model';

export class DoctorListModel extends BaseModel {
  readonly doctors?: DoctorModel[];

  constructor(doctorsList: DoctorDTO[], images?: DoctorDTO[]) {
    super();

    this.doctors = this.generateDoctorsList(doctorsList, images);
  }

  private generateDoctorsList(doctorsList: DoctorDTO[], images?: DoctorDTO[]): DoctorModel[] {
    const mergedDoctors = images ? this.addDoctorImages(doctorsList, images) : doctorsList;
    return mergedDoctors.sort((a, b) => this.sortByNameAsc(a.name, b.name)).map((doctor) => new DoctorModel(doctor));
  }

  private sortByNameAsc(nameA = '', nameB = ''): number {
    return nameA.toLocaleLowerCase().localeCompare(nameB.toLocaleLowerCase());
  }

  private addDoctorImages(doctorsList: DoctorDTO[], imagesList: DoctorDTO[] = []): DoctorDTO[] {
    const imageMap = new Map(imagesList.map((image) => [image.id, image.profileImage]));
    const doctors = doctorsList.map((doctor) => ({
      ...doctor,
      profileImage: imageMap.get(doctor.id) ?? null,
    }));

    return doctors;
  }
}
