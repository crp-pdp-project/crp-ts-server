import type { DoctorsListQueryDTO } from 'src/app/entities/dtos/input/doctorsList.input.dto';
import type { DoctorDTO } from 'src/app/entities/dtos/service/doctor.dto';
import type { SpecialtyDTO } from 'src/app/entities/dtos/service/specialty.dto';
import { DoctorListModel } from 'src/app/entities/models/doctor/doctorList.model';
import type { IGetDoctorImagesRepository } from 'src/app/repositories/rest/getDoctorImages.repository';
import { GetDoctorImagesRepository } from 'src/app/repositories/rest/getDoctorImages.repository';
import type { IGetDoctorsRepository } from 'src/app/repositories/soap/getDoctors.repository';
import { GetDoctorsRepository } from 'src/app/repositories/soap/getDoctors.repository';
import type { IGetEarliestAvailabilityRepository } from 'src/app/repositories/soap/getEarliestAvailability.repository';
import { GetEarliestAvailabilityRepository } from 'src/app/repositories/soap/getEarliestAvailability.repository';

export interface IDoctorsListInteractor {
  list(query: DoctorsListQueryDTO): Promise<DoctorListModel>;
}

export class DoctorsListInteractor implements IDoctorsListInteractor {
  constructor(
    private readonly getDoctors: IGetDoctorsRepository,
    private readonly getEarliestAvailability: IGetEarliestAvailabilityRepository,
    private readonly getImages: IGetDoctorImagesRepository,
  ) {}

  async list(query: DoctorsListQueryDTO): Promise<DoctorListModel> {
    const doctorsList = await this.getDoctorsList(query);
    const imagesList = await this.getImagesList(query.specialtyId);

    return new DoctorListModel(doctorsList, imagesList);
  }

  private async getDoctorsList(query: DoctorsListQueryDTO): Promise<DoctorDTO[]> {
    const { groupId, appointmentTypeId, inspectionId, insuranceId, specialtyId } = query;
    if (groupId && appointmentTypeId && inspectionId && insuranceId) {
      const doctorsList = await this.getEarliestAvailability.execute({
        groupId,
        appointmentTypeId,
        inspectionId,
        insuranceId,
      });

      return doctorsList;
    }
    const doctorsList = await this.getDoctors.execute(specialtyId);

    return doctorsList;
  }

  private async getImagesList(specialtyId?: SpecialtyDTO['id']): Promise<DoctorDTO[]> {
    const imagesList = await this.getImages.execute(specialtyId).catch(() => []);

    return imagesList;
  }
}

export class DoctorsListInteractorBuilder {
  static build(): DoctorsListInteractor {
    return new DoctorsListInteractor(
      new GetDoctorsRepository(),
      new GetEarliestAvailabilityRepository(),
      new GetDoctorImagesRepository(),
    );
  }
}
