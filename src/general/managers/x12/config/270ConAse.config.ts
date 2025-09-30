import { ConAse270DTO } from 'src/app/entities/dtos/service/conAse270.dto';

import { coverageTypeMap } from '../maps/coverageType.map';
import { documentTypeMap } from '../maps/documentType.map';
import { FieldMap, X12ManagerConfig } from '../x12.manager';

export class ConAse270Config implements X12ManagerConfig<ConAse270DTO> {
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
    'PRV',
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
    'REF',
    'REF',
    'DTP',
    'NM1',
    'REF',
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
    PRV: 3,
    REF: 3,
    DTP: 3,
    SE: 2,
    GE: 2,
    IEA: 2,
  };
  readonly fieldMap: FieldMap<ConAse270DTO> = {
    ipressId: [
      // ES: idRemitente
      { tag: 'ISA', element: 6, occurrence: 1 },
      { tag: 'GS', element: 2, occurrence: 1 },
    ],
    iafaId: [
      // ES: idReceptor
      { tag: 'ISA', element: 8, occurrence: 1 },
      { tag: 'GS', element: 3, occurrence: 1 },
      { tag: 'NM1', element: 9, occurrence: 2 },
    ],
    date: [{ tag: 'GS', element: 4, occurrence: 1 }], // ES: feTransaccion
    time: [{ tag: 'GS', element: 5, occurrence: 1 }], // ES: hoTransaccion
    shortDate: [{ tag: 'ISA', element: 9, occurrence: 1 }], // ES: feTransaccion (formato corto ISA09)
    shortTime: [{ tag: 'ISA', element: 10, occurrence: 1 }], // ES: hoTransaccion (formato corto ISA10)
    correlative: [
      // ES: idCorrelativo
      { tag: 'ISA', element: 13, occurrence: 1 },
      { tag: 'IEA', element: 2, occurrence: 1 },
    ],
    transactionId: [{ tag: 'ST', element: 1, occurrence: 1 }], // ES: idTransaccion
    groupControlNumber: [
      // ES: nuControl
      { tag: 'GS', element: 6, occurrence: 1 },
      { tag: 'GE', element: 2, occurrence: 1 },
    ],
    transactionSetControlNumber: [
      // ES: nuControlST
      { tag: 'ST', element: 2, occurrence: 1 },
      { tag: 'SE', element: 2, occurrence: 1 },
    ],
    purposeCode: [{ tag: 'BHT', element: 2, occurrence: 1 }], // ES: tiFinalidad
    senderEntityType: [{ tag: 'NM1', element: 2, occurrence: 1 }], // ES: caRemitente
    senderTaxId: [{ tag: 'NM1', element: 9, occurrence: 1 }], // ES: nuRucRemitente
    requestText: [{ tag: 'PRV', element: 3, occurrence: 1 }], // ES: txRequest
    receiverEntityType: [{ tag: 'NM1', element: 2, occurrence: 2 }], // ES: caReceptor
    patientEntityType: [{ tag: 'NM1', element: 2, occurrence: 3 }], // ES: caPaciente
    patientLastName: [{ tag: 'NM1', element: 3, occurrence: 3 }], // ES: apPaternoPaciente
    patientFirstName: [{ tag: 'NM1', element: 4, occurrence: 3 }], // ES: noPaciente
    patientMemberId: [{ tag: 'NM1', element: 9, occurrence: 3 }], // ES: coAfPaciente
    patientSecondLastName: [{ tag: 'NM1', element: 12, occurrence: 3 }], // ES: apMaternoPaciente
    patientDocumentType: [{ tag: 'REF', element: 2, occurrence: 1, mapper: documentTypeMap }], // ES: tiDocumento
    patientDocumentNumber: [{ tag: 'REF', element: 2, occurrence: 2 }], // ES: nuDocumento
    productCode: [{ tag: 'REF', element: 2, occurrence: 3 }], // ES: coProducto
    productDescription: [{ tag: 'REF', element: 3, occurrence: 3 }], // ES: deProducto
    productInternalCode: [{ tag: 'REF', element: 4, component: 2, occurrence: 3 }], // ES: coInProducto
    coverageNumber: [{ tag: 'REF', element: 2, occurrence: 4 }], // ES: nuCobertura
    coverageDescription: [{ tag: 'REF', element: 3, occurrence: 4 }], // ES: deCobertura
    serviceCategory: [{ tag: 'REF', element: 4, component: 1, occurrence: 4 }], // ES: caServicio
    serviceClassCode: [{ tag: 'REF', element: 4, component: 2, occurrence: 4 }], // ES: coCalservicio
    initialMaxBenefit: [{ tag: 'REF', element: 4, component: 4, occurrence: 4 }], // ES: beMaxInicial
    coverageTypeCode: [{ tag: 'REF', element: 2, occurrence: 5, mapper: coverageTypeMap }], // ES: coTiCobertura
    coverageSubtypeCode: [{ tag: 'REF', element: 4, component: 2, occurrence: 5 }], // ES: coSuTiCobertura
    applicationCode: [{ tag: 'REF', element: 2, occurrence: 6 }], // ES: coAplicativoTx
    specialtyCode: [{ tag: 'REF', element: 2, occurrence: 7 }], // ES: coEspecialidad
    relationshipCode: [{ tag: 'REF', element: 2, occurrence: 8 }], // ES: coParentesco
    planNumber: [{ tag: 'REF', element: 2, occurrence: 9 }], // ES: nuPlan
    originalAuthNumber: [{ tag: 'REF', element: 4, component: 2, occurrence: 9 }], // ES: nuAutOrigen
    accidentType: [{ tag: 'REF', element: 2, occurrence: 10 }], // ES: tiAccidente
    accidentDate: [{ tag: 'DTP', element: 3, occurrence: 1 }], // ES: feAccidente
    contractorEntityType: [{ tag: 'NM1', element: 2, occurrence: 4 }], // ES: tiCaContratante
    contractorLastName: [{ tag: 'NM1', element: 3, occurrence: 4 }], // ES: noPaContratante
    contractorFirstName: [{ tag: 'NM1', element: 4, occurrence: 4 }], // ES: noContratante
    contractorSecondLastName: [{ tag: 'NM1', element: 12, occurrence: 4 }], // ES: noMaContratante
    contractorDocumentType: [{ tag: 'REF', element: 2, occurrence: 11, mapper: documentTypeMap }], // ES: tiDoContratante
    contractorIdQualifier: [{ tag: 'REF', element: 4, component: 1, occurrence: 11 }], // ES: idReContratante
    contractorId: [{ tag: 'REF', element: 4, component: 2, occurrence: 11 }], // ES: coReContratante
  };
}
