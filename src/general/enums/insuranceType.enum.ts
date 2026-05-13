import { ErrorModel } from 'src/app/entities/models/error/error.model';

export enum InsuranceTypes {
  SITEDS = 1,
  INTERNAL = 2,
  GENERAL = 3,
}

export enum InsuranceTextTypes {
  SITEDS = 'SITEDS',
  INTERNAL = 'CONVENIO',
  GENERAL = 'PARTICULAR',
}

export class InsuranceTypesMapper {
  private static readonly insuranceTypesMap: Record<InsuranceTextTypes, InsuranceTypes> = {
    [InsuranceTextTypes.SITEDS]: InsuranceTypes.SITEDS,
    [InsuranceTextTypes.INTERNAL]: InsuranceTypes.INTERNAL,
    [InsuranceTextTypes.GENERAL]: InsuranceTypes.GENERAL,
  };

  static getInsuranceType(type: string): InsuranceTypes {
    if (!(type in this.insuranceTypesMap)) {
      throw ErrorModel.badRequest({ message: `Invalid insurance type: ${type}` });
    }
    return this.insuranceTypesMap[type as InsuranceTextTypes];
  }
}
