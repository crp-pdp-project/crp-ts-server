import { HealthInsuranceModel } from 'src/app/entities/models/healthInsurance/healthInsurance.model';
import { HealthInsuranceViewModel } from 'src/app/entities/models/healthInsurance/healthInsuranceView.model';
import {
  GetHealthInsuranceViewRepository,
  IGetHealthInsuranceViewRepository,
} from 'src/app/repositories/database/getHealthInsuranceView.repository';

export interface IHealthInsuranceViewInteractor {
  getView(): Promise<HealthInsuranceViewModel>;
}

export class HealthInsuranceViewInteractor implements IHealthInsuranceViewInteractor {
  constructor(private readonly getHealthInsurance: IGetHealthInsuranceViewRepository) {}

  async getView(): Promise<HealthInsuranceViewModel> {
    const healthInsuranceModel = await this.getViewInfo();

    return new HealthInsuranceViewModel(healthInsuranceModel);
  }

  private async getViewInfo(): Promise<HealthInsuranceModel> {
    const healthInsurance = await this.getHealthInsurance.execute();
    const model = new HealthInsuranceModel(healthInsurance);

    model.validateInsurance();

    return model;
  }
}

export class HealthInsuranceViewInteractorBuilder {
  static build(): HealthInsuranceViewInteractor {
    return new HealthInsuranceViewInteractor(new GetHealthInsuranceViewRepository());
  }
}
