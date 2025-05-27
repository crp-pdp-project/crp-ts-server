import { InsurancesListOutputDTOSchema } from 'src/app/entities/dtos/output/insurancesList.output.dto';
import { InsuranceListModel } from 'src/app/entities/models/insuranceList.model';
import { InsurancesListInteractor } from 'src/app/interactors/insurancesList/insurancesList.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { GetInsurancesRepository } from 'src/app/repositories/soap/getInsurances.repository';

import { InsurancesListController } from './insurancesList.controller';

export class InsurancesListBuilder {
  static build(): InsurancesListController {
    return new InsurancesListController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): InsurancesListInteractor {
    return new InsurancesListInteractor(new GetInsurancesRepository());
  }

  private static buildResponseInteractor(): ResponseInteractor<InsuranceListModel> {
    return new ResponseInteractor(new DataResponseStrategy(InsurancesListOutputDTOSchema));
  }
}
