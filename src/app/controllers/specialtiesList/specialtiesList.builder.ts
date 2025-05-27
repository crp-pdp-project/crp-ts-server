import { SpecialtiesListOutputDTOSchema } from 'src/app/entities/dtos/output/specialtiesList.output.dto';
import { SpecialtyListModel } from 'src/app/entities/models/specialtyList.model';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { SpecialtiesListInteractor } from 'src/app/interactors/specialtiesList/specialtiesList.interactor';
import { GetSpecialtiesRepository } from 'src/app/repositories/soap/getSpecialties.repository';

import { SpecialtiesListController } from './specialtiesList.controller';

export class SpecialtiesListBuilder {
  static build(): SpecialtiesListController {
    return new SpecialtiesListController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): SpecialtiesListInteractor {
    return new SpecialtiesListInteractor(new GetSpecialtiesRepository());
  }

  private static buildResponseInteractor(): ResponseInteractor<SpecialtyListModel> {
    return new ResponseInteractor(new DataResponseStrategy(SpecialtiesListOutputDTOSchema));
  }
}
