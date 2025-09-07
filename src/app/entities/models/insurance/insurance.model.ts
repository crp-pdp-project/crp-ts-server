import { InsuranceDTO } from 'src/app/entities/dtos/service/insurance.dto';
import { InsuranceTypes, InsuranceTypesMapper } from 'src/general/enums/insuranceType.enum';
import { TextHelper } from 'src/general/helpers/text.helper';

import { BaseModel } from '../base.model';

export class InsuranceModel extends BaseModel {
  readonly id?: string;
  readonly inspectionId?: string;
  readonly iafaId?: string;
  readonly fasId?: string;
  readonly name?: string;
  readonly type?: InsuranceTypes;

  constructor(insurance: InsuranceDTO) {
    super();

    this.id = insurance.id;
    this.inspectionId = insurance.inspectionId;
    this.iafaId = insurance.iafaId;
    this.fasId = insurance.fasId;
    this.name = TextHelper.titleCase(insurance.name);
    this.type = insurance.type ? InsuranceTypesMapper.getInsuranceType(insurance.type) : undefined;
  }
}
