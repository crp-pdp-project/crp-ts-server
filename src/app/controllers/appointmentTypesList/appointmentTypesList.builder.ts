import { AppointmentTypesListOutputDTOSchema } from 'src/app/entities/dtos/output/appointmentTypesList.output.dto';
import { AppointmentTypeListModel } from 'src/app/entities/models/appointmentTypeList.model';
import { AppointmentTypesListInteractor } from 'src/app/interactors/appointmentTypesList/appointmentTypesList.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { GetAppointmentTypesRepository } from 'src/app/repositories/soap/getAppointmentTypes.repository';

import { AppointmentTypesListController } from './appointmentTypesList.controller';

export class AppointmentTypesListBuilder {
  static build(): AppointmentTypesListController {
    return new AppointmentTypesListController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): AppointmentTypesListInteractor {
    return new AppointmentTypesListInteractor(new GetAppointmentTypesRepository());
  }

  private static buildResponseInteractor(): ResponseInteractor<AppointmentTypeListModel> {
    return new ResponseInteractor(new DataResponseStrategy(AppointmentTypesListOutputDTOSchema));
  }
}
