import { AvailabilityListOutputDTOSchema } from 'src/app/entities/dtos/output/availabilityList.output.dto';
import { AvailabilityListModel } from 'src/app/entities/models/availabilityList.model';
import { AvailabilityListInteractor } from 'src/app/interactors/availabilityList/availabilityList.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { GetDoctorAvailabilityRepository } from 'src/app/repositories/soap/getDoctorAvailability.repository';

import { AvailabilityListController } from './availabilityList.controller';

export class AvailabilityListBuilder {
  static build(): AvailabilityListController {
    return new AvailabilityListController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): AvailabilityListInteractor {
    return new AvailabilityListInteractor(new GetDoctorAvailabilityRepository());
  }

  private static buildResponseInteractor(): ResponseInteractor<AvailabilityListModel> {
    return new ResponseInteractor(new DataResponseStrategy(AvailabilityListOutputDTOSchema));
  }
}
