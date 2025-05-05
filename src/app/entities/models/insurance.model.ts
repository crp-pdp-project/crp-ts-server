import { TextHelper } from 'src/general/helpers/text.helper';

import { InsuranceDTO } from '../dtos/service/insurance.dto';

import { BaseModel } from './base.model';

export class InsuranceModel extends BaseModel {
  readonly id?: string;
  readonly inspectionId?: string;
  readonly name?: string;

  constructor(insurance: InsuranceDTO) {
    super();

    this.id = insurance.id;
    this.inspectionId = insurance.inspectionId;
    this.name = TextHelper.titleCase(insurance.name);
  }
}
