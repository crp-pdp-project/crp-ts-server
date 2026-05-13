import type { ReportTypeDTO } from 'src/app/entities/dtos/service/reportType.dto';
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
  MORNING_HOSPIOTAL = 6,
  SURGERY = 7,
  NEWBORN = 8,
}

export enum PatientReportTextTypes {
  LABORATORY = 'L',
  IMAGE = 'X',
  EXTERNAL_CONSULT = 'C',
  URGENT_CARE = 'U',
  HOSPITALIZAION = 'H',
  MORNING_HOSPIOTAL = 'D',
  SURGERY = 'Q',
  NEWBORN = 'N',
}

export enum PatientReportTypeNames {
  LABORATORY = 'Laboratorio',
  IMAGE = 'Imagenes',
  EXTERNAL_CONSULT = 'Consultas Externas',
  URGENT_CARE = 'Urgencias',
  HOSPITALIZAION = 'Hospitalización',
  MORNING_HOSPIOTAL = 'Hospital de Día',
  SURGERY = 'Cirugía',
  NEWBORN = 'Neonatos',
}

export enum PatientReportTypeResources {
  RESULTS = 'Resultados',
  IMAGE = 'Imagenes',
  INFORMS = 'Informes',
}

export class PatientReportTypesMapper {
  private static readonly reportTypeMap: Record<PatientReportTextTypes, PatientReportTypes> = {
    [PatientReportTextTypes.LABORATORY]: PatientReportTypes.LABORATORY,
    [PatientReportTextTypes.IMAGE]: PatientReportTypes.IMAGE,
    [PatientReportTextTypes.EXTERNAL_CONSULT]: PatientReportTypes.EXTERNAL_CONSULT,
    [PatientReportTextTypes.URGENT_CARE]: PatientReportTypes.URGENT_CARE,
    [PatientReportTextTypes.HOSPITALIZAION]: PatientReportTypes.HOSPITALIZAION,
    [PatientReportTextTypes.MORNING_HOSPIOTAL]: PatientReportTypes.MORNING_HOSPIOTAL,
    [PatientReportTextTypes.SURGERY]: PatientReportTypes.SURGERY,
    [PatientReportTextTypes.NEWBORN]: PatientReportTypes.NEWBORN,
  };
  private static readonly reportTypeNameMap: Record<PatientReportTextTypes, PatientReportTypeNames> = {
    [PatientReportTextTypes.LABORATORY]: PatientReportTypeNames.LABORATORY,
    [PatientReportTextTypes.IMAGE]: PatientReportTypeNames.IMAGE,
    [PatientReportTextTypes.EXTERNAL_CONSULT]: PatientReportTypeNames.EXTERNAL_CONSULT,
    [PatientReportTextTypes.URGENT_CARE]: PatientReportTypeNames.URGENT_CARE,
    [PatientReportTextTypes.HOSPITALIZAION]: PatientReportTypeNames.HOSPITALIZAION,
    [PatientReportTextTypes.MORNING_HOSPIOTAL]: PatientReportTypeNames.MORNING_HOSPIOTAL,
    [PatientReportTextTypes.SURGERY]: PatientReportTypeNames.SURGERY,
    [PatientReportTextTypes.NEWBORN]: PatientReportTypeNames.NEWBORN,
  };
  private static readonly reportGroupMap: Record<PatientReportTextTypes, PatientReportGroup> = {
    [PatientReportTextTypes.LABORATORY]: PatientReportGroup.RESULTS,
    [PatientReportTextTypes.IMAGE]: PatientReportGroup.RESULTS,
    [PatientReportTextTypes.EXTERNAL_CONSULT]: PatientReportGroup.DOCUMENTS,
    [PatientReportTextTypes.URGENT_CARE]: PatientReportGroup.DOCUMENTS,
    [PatientReportTextTypes.HOSPITALIZAION]: PatientReportGroup.DOCUMENTS,
    [PatientReportTextTypes.MORNING_HOSPIOTAL]: PatientReportGroup.DOCUMENTS,
    [PatientReportTextTypes.SURGERY]: PatientReportGroup.DOCUMENTS,
    [PatientReportTextTypes.NEWBORN]: PatientReportGroup.DOCUMENTS,
  };
  private static readonly reportTypeResourceMap: Record<PatientReportTextTypes, PatientReportTypeResources> = {
    [PatientReportTextTypes.LABORATORY]: PatientReportTypeResources.RESULTS,
    [PatientReportTextTypes.IMAGE]: PatientReportTypeResources.IMAGE,
    [PatientReportTextTypes.EXTERNAL_CONSULT]: PatientReportTypeResources.INFORMS,
    [PatientReportTextTypes.URGENT_CARE]: PatientReportTypeResources.INFORMS,
    [PatientReportTextTypes.HOSPITALIZAION]: PatientReportTypeResources.INFORMS,
    [PatientReportTextTypes.MORNING_HOSPIOTAL]: PatientReportTypeResources.INFORMS,
    [PatientReportTextTypes.SURGERY]: PatientReportTypeResources.INFORMS,
    [PatientReportTextTypes.NEWBORN]: PatientReportTypeResources.INFORMS,
  };
  static getReportType(type: string): PatientReportTypes {
    if (!(type in this.reportTypeMap)) {
      throw ErrorModel.badRequest({ message: `Invalid patient report type: ${type}` });
    }
    return this.reportTypeMap[type as PatientReportTextTypes];
  }
  static getReportTypeName(type: string): PatientReportTypeNames {
    if (!(type in this.reportTypeNameMap)) {
      throw ErrorModel.badRequest({ message: `Invalid patient report type: ${type}` });
    }
    return this.reportTypeNameMap[type as PatientReportTextTypes];
  }
  static getReportTypeResource(type: string): PatientReportTypeResources {
    if (!(type in this.reportTypeResourceMap)) {
      throw ErrorModel.badRequest({ message: `Invalid patient report type: ${type}` });
    }
    return this.reportTypeResourceMap[type as PatientReportTextTypes];
  }
  static getReportGroup(type: string): PatientReportGroup {
    if (!(type in this.reportGroupMap)) {
      throw ErrorModel.badRequest({ message: `Invalid patient report type: ${type}` });
    }
    return this.reportGroupMap[type as PatientReportTextTypes];
  }
  static getReportTypeDto(type: string): ReportTypeDTO {
    if (!(type in this.reportTypeMap)) {
      throw ErrorModel.badRequest({ message: `Invalid patient report type: ${type}` });
    }
    return {
      id: this.reportTypeMap[type as PatientReportTextTypes],
      name: this.reportTypeNameMap[type as PatientReportTextTypes],
      resource: this.reportTypeResourceMap[type as PatientReportTextTypes],
      group: this.reportGroupMap[type as PatientReportTextTypes],
    };
  }
}
