export enum PatientDocumentType {
  DNI = 14,
  CE = 8,
  PASS = 7,
}

export enum GuaranteeLetterDocumentType {
  DNI = '01',
  CE = '03',
  PASS = '06',
}

export class GuaranteeLetterDocumentTypeMapper {
  private static readonly documentTypeMap: Record<PatientDocumentType, GuaranteeLetterDocumentType> = {
    [PatientDocumentType.DNI]: GuaranteeLetterDocumentType.DNI,
    [PatientDocumentType.CE]: GuaranteeLetterDocumentType.CE,
    [PatientDocumentType.PASS]: GuaranteeLetterDocumentType.PASS,
  };
  static getAppointmentState(type: PatientDocumentType): GuaranteeLetterDocumentType {
    return this.documentTypeMap[type];
  }
}

export enum PatientGender {
  MALE = 'H',
  FEMALE = 'M',
}
