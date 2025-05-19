import { AppointmentTypesListOutputDTOSchema } from 'src/app/entities/dtos/output/appointmentTypesList.output.dto';
import { AppointmentTypeListModel } from 'src/app/entities/models/appointmentTypeList.model';
import { AppointmentTypesListInteractor } from 'src/app/interactors/appointmentTypesList/appointmentTypesList.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { GetAppointmentTypesRepository } from 'src/app/repositories/soap/getAppointmentTypes.repository';

import { AppointmentTypesListController } from './appointmentTypesList.controller';

export class AppointmentTypesListBuilder {
  static build(): AppointmentTypesListController {
    const getAppointmentTypes = new GetAppointmentTypesRepository();
    const responseStrategy = new DataResponseStrategy(AppointmentTypesListOutputDTOSchema);
    const appointmentTypesInteractor = new AppointmentTypesListInteractor(getAppointmentTypes);
    const responseInteractor = new ResponseInteractor<AppointmentTypeListModel>(responseStrategy);

    return new AppointmentTypesListController(appointmentTypesInteractor, responseInteractor);
  }
}
