import { InsuranceListModel } from 'src/app/entities/models/insurance/insuranceList.model';
import { GetInsurancesRepository, IGetInsurancesRepository } from 'src/app/repositories/rest/getInsurances.repository';

export interface IInsurancesListInteractor {
  list(): Promise<InsuranceListModel>;
}

export class InsurancesListInteractor implements IInsurancesListInteractor {
  constructor(private readonly getInsurances: IGetInsurancesRepository) {}

  async list(): Promise<InsuranceListModel> {
    const insurancesList = await this.getInsurances.execute();

    return new InsuranceListModel(insurancesList);
  }
}

export class InsurancesListInteractorBuilder {
  static build(): InsurancesListInteractor {
    return new InsurancesListInteractor(new GetInsurancesRepository());
  }
}
