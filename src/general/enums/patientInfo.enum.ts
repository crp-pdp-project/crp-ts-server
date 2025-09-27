export enum PatientDocumentType {
  DNI = 14,
  CE = 8,
  PASS = 7,
}

export enum CRPDocumentType {
  DNI = '01',
  CE = '03',
  PASS = '06',
}

export enum SitedsDocumentType {
  DNI = '1',
  CE = '3',
  PASS = '6',
}

export class DocumentTypeMapper {
  private static readonly crpDocumentTypeMap: Record<PatientDocumentType, CRPDocumentType> = {
    [PatientDocumentType.DNI]: CRPDocumentType.DNI,
    [PatientDocumentType.CE]: CRPDocumentType.CE,
    [PatientDocumentType.PASS]: CRPDocumentType.PASS,
  };

  private static readonly sitedsDocumentTypeMap: Record<PatientDocumentType, SitedsDocumentType> = {
    [PatientDocumentType.DNI]: SitedsDocumentType.DNI,
    [PatientDocumentType.CE]: SitedsDocumentType.CE,
    [PatientDocumentType.PASS]: SitedsDocumentType.PASS,
  };

  static getCrpDocumentType(type: PatientDocumentType): CRPDocumentType {
    return this.crpDocumentTypeMap[type];
  }

  static getSitedsDocumentType(type: PatientDocumentType): SitedsDocumentType {
    return this.sitedsDocumentTypeMap[type];
  }
}

export enum PatientGender {
  MALE = 'H',
  FEMALE = 'M',
}
