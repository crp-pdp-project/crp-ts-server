import { AppointmentTypesListOutputDTOSchema } from 'src/app/entities/dtos/output/appointmentTypesList.output.dto';
import { AppointmentTypeModel } from 'src/app/entities/models/appointmentType.model';
import { AppointmentTypesListInteractor } from 'src/app/interactors/appointmentTypesList/appointmentTypesList.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { GetAppointmentTypesRepository } from 'src/app/repositories/soap/getAppointmentTypes.repository';

import { AppointmentTypesListController } from './appointmentTypesList.controller';

export class AppointmentTypesListBuilder {
  static build(): AppointmentTypesListController {
    const getAppointmentTypes = new GetAppointmentTypesRepository();
    const responseStrategy = new SuccessResponseStrategy(AppointmentTypesListOutputDTOSchema);
    const appointmentTypesInteractor = new AppointmentTypesListInteractor(getAppointmentTypes);
    const responseInteractor = new ResponseInteractor<AppointmentTypeModel[]>(responseStrategy);

    return new AppointmentTypesListController(appointmentTypesInteractor, responseInteractor);
  }
}
