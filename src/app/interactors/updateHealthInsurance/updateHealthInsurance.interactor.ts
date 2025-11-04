import { UpdateHealthInsuranceBodyDTO } from 'src/app/entities/dtos/input/updateHealthInsuranceView.input.dto';
import {
  IUpdateHealthInsuranceRepository,
  UpdateHealthInsuranceRepository,
} from 'src/app/repositories/database/updateHealthInsuranceView.repository';

export interface IUpdateHealthInsuranceInteractor {
  verify(body: UpdateHealthInsuranceBodyDTO): Promise<void>;
}

export class UpdateHealthInsuranceInteractor implements IUpdateHealthInsuranceInteractor {
  constructor(private readonly updateHealthInsurance: IUpdateHealthInsuranceRepository) {}

  async verify(body: UpdateHealthInsuranceBodyDTO): Promise<void> {
    await this.updateHealthInsurance.execute(body);
  }
}

export class UpdateHealthInsuranceInteractorBuilder {
  static build(): UpdateHealthInsuranceInteractor {
    return new UpdateHealthInsuranceInteractor(new UpdateHealthInsuranceRepository());
  }
}
