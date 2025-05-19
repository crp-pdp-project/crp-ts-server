import { SpecialtiesListOutputDTOSchema } from 'src/app/entities/dtos/output/specialtiesList.output.dto';
import { SpecialtyListModel } from 'src/app/entities/models/specialtyList.model';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { SpecialtiesListInteractor } from 'src/app/interactors/specialtiesList/specialtiesList.interactor';
import { GetSpecialtiesRepository } from 'src/app/repositories/soap/getSpecialties.repository';

import { SpecialtiesListController } from './specialtiesList.controller';

export class SpecialtiesListBuilder {
  static build(): SpecialtiesListController {
    const getSpecialties = new GetSpecialtiesRepository();
    const responseStrategy = new DataResponseStrategy(SpecialtiesListOutputDTOSchema);
    const specialtiesInteractor = new SpecialtiesListInteractor(getSpecialties);
    const responseInteractor = new ResponseInteractor<SpecialtyListModel>(responseStrategy);

    return new SpecialtiesListController(specialtiesInteractor, responseInteractor);
  }
}
