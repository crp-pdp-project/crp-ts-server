import { InsurancesListOutputDTOSchema } from 'src/app/entities/dtos/output/insurancesList.output.dto';
import { SpecialtyModel } from 'src/app/entities/models/specialty.model';
import { InsurancesListInteractor } from 'src/app/interactors/insurancesList/insurancesList.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { GetInsurancesRepository } from 'src/app/repositories/soap/getInsurances.repository';

import { InsurancesListController } from './insurancesList.controller';

export class InsurancesListBuilder {
  static build(): InsurancesListController {
    const getInsurances = new GetInsurancesRepository();
    const responseStrategy = new SuccessResponseStrategy(InsurancesListOutputDTOSchema);
    const insurancesInteractor = new InsurancesListInteractor(getInsurances);
    const responseInteractor = new ResponseInteractor<SpecialtyModel[]>(responseStrategy);

    return new InsurancesListController(insurancesInteractor, responseInteractor);
  }
}
