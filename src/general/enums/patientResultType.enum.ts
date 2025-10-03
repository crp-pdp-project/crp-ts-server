import { ErrorModel } from 'src/app/entities/models/error/error.model';

export enum PatientResultTypes {
  LAB = 1,
  IMAGE = 2,
}

export enum PatientResultTextTypes {
  LAB = 'L',
  IMAGE = 'X',
}

export class PatientResultTypesMapper {
  private static readonly resultTypeMap: Record<PatientResultTextTypes, PatientResultTypes> = {
    [PatientResultTextTypes.LAB]: PatientResultTypes.LAB,
    [PatientResultTextTypes.IMAGE]: PatientResultTypes.IMAGE,
  };
  static getResultType(type: string): PatientResultTypes {
    if (!(type in this.resultTypeMap)) {
      throw ErrorModel.badRequest({ message: `Invalid patient result type: ${type}` });
    }
    return this.resultTypeMap[type as PatientResultTextTypes];
  }
}
