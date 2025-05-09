import { AvailabilityListOutputDTOSchema } from 'src/app/entities/dtos/output/availabilityList.output.dto';
import { AvailabilityListModel } from 'src/app/entities/models/availabilityList.model';
import { AvailabilityListInteractor } from 'src/app/interactors/availabilityList/availabilityList.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { GetDoctorAvailabilityRepository } from 'src/app/repositories/soap/getDoctorAvailability.repository';

import { AvailabilityListController } from './availabilityList.controller';

export class AvailabilityListBuilder {
  static build(): AvailabilityListController {
    const availabilityList = new GetDoctorAvailabilityRepository();
    const responseStrategy = new SuccessResponseStrategy(AvailabilityListOutputDTOSchema);
    const availabilityInteractor = new AvailabilityListInteractor(availabilityList);
    const responseInteractor = new ResponseInteractor<AvailabilityListModel>(responseStrategy);

    return new AvailabilityListController(availabilityInteractor, responseInteractor);
  }
}
