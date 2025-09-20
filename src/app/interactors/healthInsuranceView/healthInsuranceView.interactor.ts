import { HealthInsuranceDTO } from 'src/app/entities/dtos/service/healthInsurance.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { HealthInsuranceViewModel } from 'src/app/entities/models/healthInsurance/healthInsuranceView.model';
import {
  GetHealthInsuranceRepository,
  IGetHealthInsuranceRepository,
} from 'src/app/repositories/database/getHealthPlan.repository';

export interface IHealthInsuranceViewInteractor {
  getView(): Promise<HealthInsuranceViewModel>;
}

export class HealthInsuranceViewInteractor implements IHealthInsuranceViewInteractor {
  constructor(private readonly getHealthInsurance: IGetHealthInsuranceRepository) {}

  async getView(): Promise<HealthInsuranceViewModel> {
    const healthInsurance = await this.getViewInfo();

    return new HealthInsuranceViewModel(healthInsurance);
  }

  private async getViewInfo(): Promise<HealthInsuranceDTO> {
    const healthInsurance = await this.getHealthInsurance.execute();

    if (!healthInsurance) {
      throw ErrorModel.notFound({ message: 'No health insurance view available' });
    }

    return healthInsurance;
  }
}

export class HealthInsuranceViewInteractorBuilder {
  static build(): HealthInsuranceViewInteractor {
    return new HealthInsuranceViewInteractor(new GetHealthInsuranceRepository());
  }
}
