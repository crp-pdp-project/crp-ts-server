import { FastifyRequest } from 'fastify';

import {
  DoctorsListInputDTO,
  DoctorsListQueryDTO,
  DoctorsListQueryDTOSchema,
} from 'src/app/entities/dtos/input/doctorsList.input.dto';
import { DoctorDTO } from 'src/app/entities/dtos/service/doctor.dto';
import { SpecialtyDTO } from 'src/app/entities/dtos/service/specialty.dto';
import { DoctorListModel } from 'src/app/entities/models/doctorList.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { IGetDoctorImagesRepository } from 'src/app/repositories/rest/getDoctorImages.repository';
import { IGetDoctorsRepository } from 'src/app/repositories/soap/getDoctors.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface IDoctorsListInteractor {
  list(input: FastifyRequest<DoctorsListInputDTO>): Promise<DoctorListModel | ErrorModel>;
}

export class DoctorsListInteractor implements IDoctorsListInteractor {
  constructor(
    private readonly getDoctors: IGetDoctorsRepository,
    private readonly getImages: IGetDoctorImagesRepository,
  ) {}

  async list(input: FastifyRequest<DoctorsListInputDTO>): Promise<DoctorListModel | ErrorModel> {
    try {
      this.validateSession(input.session);
      const specialtyId = this.validateInput(input.query);
      const doctorsList = await this.getDoctorsList(specialtyId);
      const imagesList = await this.getImagesList(specialtyId);
      return new DoctorListModel(doctorsList, imagesList);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateInput(query?: DoctorsListQueryDTO): SpecialtyDTO['id'] {
    const { specialtyId } = DoctorsListQueryDTOSchema.parse(query);

    return specialtyId;
  }

  private validateSession(session?: SessionModel): void {
    if (!(session instanceof SignInSessionModel)) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }
  }

  private async getDoctorsList(specialtyId?: SpecialtyDTO['id']): Promise<DoctorDTO[]> {
    const doctorsList = await this.getDoctors.execute(specialtyId);

    return doctorsList;
  }

  private async getImagesList(specialtyId?: SpecialtyDTO['id']): Promise<DoctorDTO[]> {
    const imagesList = await this.getImages.execute(specialtyId).catch(() => []);

    return imagesList;
  }
}
