import { HealthInsuranceModel } from 'src/app/entities/models/healthInsurance/healthInsurance.model';
import {
  GetHealthInsuranceViewRepository,
  IGetHealthInsuranceViewRepository,
} from 'src/app/repositories/database/getHealthInsuranceView.repository';

export interface IHealthInsuranceDataInteractor {
  get(): Promise<HealthInsuranceModel>;
}

export class HealthInsuranceDataInteractor implements IHealthInsuranceDataInteractor {
  constructor(private readonly getHealthInsurance: IGetHealthInsuranceViewRepository) {}

  async get(): Promise<HealthInsuranceModel> {
    const healthInsurance = await this.getHealthInsurance.execute();
    const model = new HealthInsuranceModel(healthInsurance);

    return model.validateInsurance();
  }
}

export class HealthInsuranceDataInteractorBuilder {
  static build(): HealthInsuranceDataInteractor {
    return new HealthInsuranceDataInteractor(new GetHealthInsuranceViewRepository());
  }
}
