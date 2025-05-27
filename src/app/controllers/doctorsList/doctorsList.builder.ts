import { DoctorsListOutputDTOSchema } from 'src/app/entities/dtos/output/doctorsList.output.dto';
import { DoctorListModel } from 'src/app/entities/models/doctorList.model';
import { DoctorsListInteractor } from 'src/app/interactors/doctorsList/doctorsList.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { GetDoctorImagesRepository } from 'src/app/repositories/rest/getDoctorImages.repository';
import { GetDoctorsRepository } from 'src/app/repositories/soap/getDoctors.repository';

import { DoctorsListController } from './doctorsList.controller';

export class DoctorsListBuilder {
  static build(): DoctorsListController {
    return new DoctorsListController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): DoctorsListInteractor {
    return new DoctorsListInteractor(new GetDoctorsRepository(), new GetDoctorImagesRepository());
  }

  private static buildResponseInteractor(): ResponseInteractor<DoctorListModel> {
    return new ResponseInteractor(new DataResponseStrategy(DoctorsListOutputDTOSchema));
  }
}
