import { ErrorModel } from 'src/app/entities/models/error/error.model';

export enum PatientReportGroup {
  ALL = 'all',
  DOCUMENTS = 'documents',
  RESULTS = 'results',
}

export enum PatientReportTypes {
  LABORATORY = 1,
  IMAGE = 2,
  EXTERNAL_CONSULT = 3,
  URGENT_CARE = 4,
  HOSPITALIZAION = 5,
}

export enum PatientReportTextTypes {
  LABORATORY = 'L',
  IMAGE = 'X',
  EXTERNAL_CONSULT = 'C',
  URGENT_CARE = 'U',
  HOSPITALIZAION = 'H',
}

export class PatientReportTypesMapper {
  private static readonly reportTypeMap: Record<PatientReportTextTypes, PatientReportTypes> = {
    [PatientReportTextTypes.LABORATORY]: PatientReportTypes.LABORATORY,
    [PatientReportTextTypes.IMAGE]: PatientReportTypes.IMAGE,
    [PatientReportTextTypes.EXTERNAL_CONSULT]: PatientReportTypes.EXTERNAL_CONSULT,
    [PatientReportTextTypes.URGENT_CARE]: PatientReportTypes.URGENT_CARE,
    [PatientReportTextTypes.HOSPITALIZAION]: PatientReportTypes.HOSPITALIZAION,
  };
  private static readonly reportGroupMap: Record<PatientReportTextTypes, PatientReportGroup> = {
    [PatientReportTextTypes.LABORATORY]: PatientReportGroup.RESULTS,
    [PatientReportTextTypes.IMAGE]: PatientReportGroup.RESULTS,
    [PatientReportTextTypes.EXTERNAL_CONSULT]: PatientReportGroup.DOCUMENTS,
    [PatientReportTextTypes.URGENT_CARE]: PatientReportGroup.DOCUMENTS,
    [PatientReportTextTypes.HOSPITALIZAION]: PatientReportGroup.DOCUMENTS,
  };
  static getReportType(type: string): PatientReportTypes {
    if (!(type in this.reportTypeMap)) {
      throw ErrorModel.badRequest({ message: `Invalid patient report type: ${type}` });
    }
    return this.reportTypeMap[type as PatientReportTextTypes];
  }
  static getReportGroup(type: string): PatientReportGroup {
    if (!(type in this.reportGroupMap)) {
      throw ErrorModel.badRequest({ message: `Invalid patient report type: ${type}` });
    }
    return this.reportGroupMap[type as PatientReportTextTypes];
  }
}
