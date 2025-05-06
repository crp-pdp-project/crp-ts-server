import { SpecialtiesListOutputDTOSchema } from 'src/app/entities/dtos/output/specialtiesList.output.dto';
import { SpecialtyModel } from 'src/app/entities/models/specialty.model';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { SpecialtiesListInteractor } from 'src/app/interactors/specialtiesList/specialtiesList.interactor';
import { GetSpecialtiesRepository } from 'src/app/repositories/soap/getSpecialties.repository';

import { SpecialtiesListController } from './specialtiesList.controller';

export class SpecialtiesListBuilder {
  static build(): SpecialtiesListController {
    const getSpecialties = new GetSpecialtiesRepository();
    const responseStrategy = new SuccessResponseStrategy(SpecialtiesListOutputDTOSchema);
    const specialtiesInteractor = new SpecialtiesListInteractor(getSpecialties);
    const responseInteractor = new ResponseInteractor<SpecialtyModel[]>(responseStrategy);

    return new SpecialtiesListController(specialtiesInteractor, responseInteractor);
  }
}
