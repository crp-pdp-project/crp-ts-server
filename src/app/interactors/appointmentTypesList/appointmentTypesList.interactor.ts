import { AppointmentTypesListQueryDTO } from 'src/app/entities/dtos/input/appointmentTypesList.input.dto';
import { AppointmentTypeListModel } from 'src/app/entities/models/appointmentType/appointmentTypeList.model';
import {
  GetAppointmentTypesRepository,
  IGetAppointmentTypesRepository,
} from 'src/app/repositories/soap/getAppointmentTypes.repository';

export interface IAppointmentTypesListInteractor {
  list(query: AppointmentTypesListQueryDTO): Promise<AppointmentTypeListModel>;
}

export class AppointmentTypesListInteractor implements IAppointmentTypesListInteractor {
  constructor(private readonly getAppointmentTypes: IGetAppointmentTypesRepository) {}

  async list(query: AppointmentTypesListQueryDTO): Promise<AppointmentTypeListModel> {
    const appointmentTypesList = await this.getAppointmentTypes.execute(
      query.doctorId,
      query.specialtyId,
      query.insuranceId,
    );

    return new AppointmentTypeListModel(appointmentTypesList);
  }
}

export class AppointmentTypesListInteractorBuilder {
  static build(): AppointmentTypesListInteractor {
    return new AppointmentTypesListInteractor(new GetAppointmentTypesRepository());
  }
}
