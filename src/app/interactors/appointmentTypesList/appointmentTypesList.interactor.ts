import { FastifyRequest } from 'fastify';

import {
  AppointmentTypesListInputDTO,
  AppointmentTypesListQueryDTO,
  AppointmentTypesListQueryDTOSchema,
} from 'src/app/entities/dtos/input/appointmentTypesList.input.dto';
import { AppointmentTypeDTO } from 'src/app/entities/dtos/service/appointmentType.dto';
import { AppointmentTypeListModel } from 'src/app/entities/models/appointmentTypeList.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IGetAppointmentTypesRepository } from 'src/app/repositories/soap/getAppointmentTypes.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface IAppointmentTypesListInteractor {
  list(input: FastifyRequest<AppointmentTypesListInputDTO>): Promise<AppointmentTypeListModel | ErrorModel>;
}

export class AppointmentTypesListInteractor implements IAppointmentTypesListInteractor {
  constructor(private readonly getAppointmentTypes: IGetAppointmentTypesRepository) {}

  async list(input: FastifyRequest<AppointmentTypesListInputDTO>): Promise<AppointmentTypeListModel | ErrorModel> {
    try {
      this.validateSession(input.session);
      const query = this.validateInput(input.query);
      const appointmentTypesList = await this.getAppointmentTypesList(query);
      return new AppointmentTypeListModel(appointmentTypesList);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateInput(input?: AppointmentTypesListQueryDTO): AppointmentTypesListQueryDTO {
    const query = AppointmentTypesListQueryDTOSchema.parse(input);

    return query;
  }

  private validateSession(session?: SessionModel): void {
    if (!session) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }
  }

  private async getAppointmentTypesList(query: AppointmentTypesListQueryDTO): Promise<AppointmentTypeDTO[]> {
    const appointmentTypesList = await this.getAppointmentTypes.execute(
      query.doctorId,
      query.specialtyId,
      query.insuranceId,
    );

    return appointmentTypesList;
  }
}
