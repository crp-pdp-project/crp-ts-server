import { ConCod271DTO } from 'src/app/entities/dtos/service/conCod271.dto';

import { affiliationTypeMap } from '../maps/affiliationType.map';
import { documentTypeMap } from '../maps/documentType.map';
import { planTypeMap } from '../maps/planType.map';
import { statusTypeMap } from '../maps/statusType.map';
import { FieldMap, X12ManagerConfig } from '../x12.manager';

import { ConCod271DetailConfig } from './271ConCodDetail.config';

export class ConCod271Config implements X12ManagerConfig<ConCod271DTO> {
  readonly segmentDelimiter: string = '~';
  readonly elementDelimiter: string = '*';
  readonly componentDelimiter: string = ':';

  readonly segmentSequence: string[] = [
    'ISA',
    'GS',
    'ST',
    'BHT',
    'HL',
    'NM1',
    'REF',
    'DTP',
    'HL',
    'NM1',
    'HL',
    'NM1',
    'REF',
    'REF',
    'REF',
    'REF',
    'REF',
    'REF',
    'REF',
    'REF',
    'DMG',
    'DTP',
    'DTP',
    'NM1',
    'REF',
    'NM1',
    'REF',
    'DTP',
    'SE',
    'GE',
    'IEA',
  ];

  readonly segmentLength: Record<string, number> = {
    ISA: 16,
    GS: 8,
    ST: 3,
    BHT: 2,
    HL: 4,
    NM1: 12,
    REF: 4,
    DTP: 3,
    DMG: 5,
    SE: 2,
    GE: 2,
    IEA: 2,
  };

  readonly fieldMap: FieldMap<ConCod271DTO> = {
    ipressId: [
      // ES: idReceptor
      { tag: 'ISA', element: 8, occurrence: 1 },
      { tag: 'GS', element: 3, occurrence: 1 },
    ],
    iafaId: [
      // ES: idRemitente
      { tag: 'ISA', element: 6, occurrence: 1 },
      { tag: 'GS', element: 2, occurrence: 1 },
    ],
    date: [{ tag: 'GS', element: 4, occurrence: 1 }], // ES: feTransaccion
    time: [{ tag: 'GS', element: 5, occurrence: 1 }], // ES: hoTransaccion
    shortDate: [{ tag: 'ISA', element: 9, occurrence: 1 }], // ES: feTransaccion (corta)
    shortTime: [{ tag: 'ISA', element: 10, occurrence: 1 }], // ES: hoTransaccion (corta)
    correlationId: [
      // ES: idCorrelativo
      { tag: 'ISA', element: 13, occurrence: 1 },
      { tag: 'IEA', element: 2, occurrence: 1 },
    ],
    transactionId: [{ tag: 'ST', element: 1, occurrence: 1 }], // ES: idTransaccion
    purposeCode: [{ tag: 'BHT', element: 2, occurrence: 1 }], // ES: tiFinalidad
    controlNumber: [
      // ES: nuControl
      { tag: 'GS', element: 6, occurrence: 1 },
      { tag: 'GE', element: 2, occurrence: 1 },
    ],
    transactionSetControlNumber: [
      // ES: nuControlST
      { tag: 'ST', element: 2, occurrence: 1 },
      { tag: 'SE', element: 2, occurrence: 1 },
    ],
    senderCategory: [{ tag: 'NM1', element: 2, occurrence: 1 }], // ES: caRemitente
    senderUser: [{ tag: 'REF', element: 2, occurrence: 1 }], // ES: usRemitente
    senderPassword: [{ tag: 'REF', element: 4, component: 2, occurrence: 1 }], // ES: pwRemitente
    photoUploadDate: [{ tag: 'DTP', element: 3, occurrence: 1 }], // ES: feSubidaFoto
    receiverCategory: [{ tag: 'NM1', element: 2, occurrence: 2 }], // ES: caReceptor
    receiverTaxId: [{ tag: 'NM1', element: 9, occurrence: 2 }], // ES: nuRucReceptor
    patientCategory: [{ tag: 'NM1', element: 2, occurrence: 3 }], // ES: caPaciente
    patientLastName: [{ tag: 'NM1', element: 3, occurrence: 3 }], // ES: apPaternoPaciente
    patientFirstName: [{ tag: 'NM1', element: 4, occurrence: 3 }], // ES: noPaciente
    patientAffiliation: [{ tag: 'NM1', element: 9, occurrence: 3 }], // ES: coAfPaciente
    patientSecondLastName: [{ tag: 'NM1', element: 12, occurrence: 3 }], // ES: apMaternoPaciente
    patientStatusCode: [{ tag: 'REF', element: 2, occurrence: 2, mapper: statusTypeMap }], // ES: coEstadoPaciente
    patientDocumentType: [{ tag: 'REF', element: 2, occurrence: 3, mapper: documentTypeMap }], // ES: tiDocumento
    patientDocumentNumber: [{ tag: 'REF', element: 4, component: 2, occurrence: 3 }], // ES: nuDocumento
    patientIdentifier: [{ tag: 'REF', element: 2, occurrence: 4 }], // ES: idPaciente
    patientContractNumber: [{ tag: 'REF', element: 2, occurrence: 5 }], // ES: nuContrato
    policyNumber: [{ tag: 'REF', element: 4, component: 2, occurrence: 5 }], // ES: nuPoliza
    certificateNumber: [{ tag: 'REF', element: 4, component: 4, occurrence: 5 }], // ES: nuCertificado
    policyTypeCode: [{ tag: 'REF', element: 4, component: 6, occurrence: 5, mapper: affiliationTypeMap }], // ES: coTipoPoliza
    productCode: [{ tag: 'REF', element: 2, occurrence: 6 }], // ES: coProducto
    productDescription: [{ tag: 'REF', element: 3, occurrence: 6 }], // ES: deProducto
    planNumber: [{ tag: 'REF', element: 2, occurrence: 7 }], // ES: nuPlan
    healthPlanType: [{ tag: 'REF', element: 4, component: 2, occurrence: 7, mapper: planTypeMap }], // ES: tiPlanSalud
    currencyCode: [{ tag: 'REF', element: 4, component: 4, occurrence: 7 }], // ES: coMoneda
    relationshipCode: [{ tag: 'REF', element: 2, occurrence: 8 }], // ES: coParentesco
    benefitSubjectCode: [{ tag: 'REF', element: 2, occurrence: 9 }], // ES: coSujetoBeneficio
    benefitSubjectNumber: [{ tag: 'REF', element: 4, component: 2, occurrence: 9 }], // ES: nuSujetoBeneficio
    birthDate: [{ tag: 'DMG', element: 2, occurrence: 1 }], // ES: feNacimiento
    gender: [{ tag: 'DMG', element: 3, occurrence: 1 }], // ES: sexo
    maritalStatus: [{ tag: 'DMG', element: 4, occurrence: 1 }], // ES: esCivil
    coverageStartDate: [{ tag: 'DTP', element: 3, occurrence: 2 }], // ES: feInicioCobertura
    coverageEndDate: [{ tag: 'DTP', element: 3, occurrence: 3 }], // ES: feFinCobertura
    contractorCategory: [{ tag: 'NM1', element: 2, occurrence: 4 }], // ES: tiCaContratante
    contractorLastName: [{ tag: 'NM1', element: 3, occurrence: 4 }], // ES: noPaContratante
    contractorFirstName: [{ tag: 'NM1', element: 4, occurrence: 4 }], // ES: noContratante
    contractorSecondLastName: [{ tag: 'NM1', element: 12, occurrence: 4 }], // ES: noMaContratante
    contractorDocumentType: [{ tag: 'REF', element: 2, occurrence: 10, mapper: documentTypeMap }], // ES: tiDoContratante
    contractorIdRef: [{ tag: 'REF', element: 4, component: 1, occurrence: 10 }], // ES: idReContratante
    contractorRefCode: [{ tag: 'REF', element: 4, component: 2, occurrence: 10 }], // ES: coReContratante
    holderCategory: [{ tag: 'NM1', element: 2, occurrence: 5 }], // ES: caTitular
    holderLastName: [{ tag: 'NM1', element: 3, occurrence: 5 }], // ES: apPaternoTitular
    holderFirstName: [{ tag: 'NM1', element: 4, occurrence: 5 }], // ES: noTitular
    holderAffiliation: [{ tag: 'NM1', element: 9, occurrence: 5 }], // ES: coAfTitular
    holderSecondLastName: [{ tag: 'NM1', element: 12, occurrence: 5 }], // ES: apMaternoTitular
    holderDocumentType: [{ tag: 'REF', element: 2, occurrence: 11, mapper: documentTypeMap }], // ES: tiDoTitular
    holderDocumentNumber: [{ tag: 'REF', element: 4, component: 2, occurrence: 11 }], // ES: nuDocTitular
    holderEnrollmentDate: [{ tag: 'DTP', element: 3, occurrence: 4 }], // ES: feAfiliacionTitular
    details: {
      startTag: 'DTP',
      startOccurrence: 4,
      endTag: 'SE',
      endOccurrence: 1,
      config: new ConCod271DetailConfig(),
    },
  };
}
