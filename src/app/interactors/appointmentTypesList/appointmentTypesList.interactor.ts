import { FastifyRequest } from 'fastify';

import {
  AppointmentTypesListInputDTO,
  AppointmentTypesListQueryDTO,
  AppointmentTypesListQueryDTOSchema,
} from 'src/app/entities/dtos/input/appointmentTypesList.input.dto';
import { AppointmentTypeDTO } from 'src/app/entities/dtos/service/appointmentType.dto';
import { DoctorDTO } from 'src/app/entities/dtos/service/doctor.dto';
import { InsuranceDTO } from 'src/app/entities/dtos/service/insurance.dto';
import { SpecialtyDTO } from 'src/app/entities/dtos/service/specialty.dto';
import { AppointmentTypeModel } from 'src/app/entities/models/appointmentType.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IGetAppointmentTypesRepository } from 'src/app/repositories/soap/getAppointmentTypes.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface IAppointmentTypesListInteractor {
  list(input: FastifyRequest<AppointmentTypesListInputDTO>): Promise<AppointmentTypeModel[] | ErrorModel>;
}

export class AppointmentTypesListInteractor implements IAppointmentTypesListInteractor {
  constructor(private readonly getAppointmentTypes: IGetAppointmentTypesRepository) {}

  async list(input: FastifyRequest<AppointmentTypesListInputDTO>): Promise<AppointmentTypeModel[] | ErrorModel> {
    try {
      this.validateSession(input.session);
      const body = this.validateInput(input.query);
      const appointmentTypesList = await this.getAppointmentTypesList(
        body.doctorId,
        body.specialtyId,
        body.insuranceId,
      );
      return this.generateModels(appointmentTypesList);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateInput(query?: AppointmentTypesListQueryDTO): AppointmentTypesListQueryDTO {
    const body = AppointmentTypesListQueryDTOSchema.parse(query);

    return body;
  }

  private validateSession(session?: SessionModel): void {
    if (!session) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }
  }

  private async getAppointmentTypesList(
    doctorId: DoctorDTO['id'],
    specialtyId: SpecialtyDTO['id'],
    insuranceId?: InsuranceDTO['id'],
  ): Promise<AppointmentTypeDTO[]> {
    const appointmentTypesList = await this.getAppointmentTypes.execute(doctorId!, specialtyId!, insuranceId);

    return appointmentTypesList;
  }

  private generateModels(appointmentTypesList: AppointmentTypeDTO[]): AppointmentTypeModel[] {
    const models = appointmentTypesList.map((appointmentType) => new AppointmentTypeModel(appointmentType));
    return models;
  }
}
