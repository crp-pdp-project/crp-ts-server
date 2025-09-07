import { InsuranceDTO } from 'src/app/entities/dtos/service/insurance.dto';

import { BaseModel } from '../base.model';

import { InsuranceModel } from './insurance.model';

export class InsuranceListModel extends BaseModel {
  readonly insurances: InsuranceModel[];

  constructor(insurancesList: InsuranceDTO[]) {
    super();

    this.insurances = this.generateInsurancesList(insurancesList);
  }

  private generateInsurancesList(insurancesList: InsuranceDTO[]): InsuranceModel[] {
    return insurancesList.map((insurance) => new InsuranceModel(insurance));
  }
}
