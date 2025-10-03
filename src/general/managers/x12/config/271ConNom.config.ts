import { ConNom271DTO } from 'src/app/entities/dtos/service/conNom271.dto';

import { entityTypeMap } from '../maps/entityType.map';
import { FieldMap, X12ManagerConfig } from '../x12.manager';

import { ConNom271DetailConfig } from './271ConNomDetail.config';

export class ConNom271Config implements X12ManagerConfig<ConNom271DTO> {
  readonly segmentDelimiter: string = '~';
  readonly elementDelimiter: string = '*';
  readonly componentDelimiter: string = ':';
  readonly segmentSequence: string[] = ['ISA', 'GS', 'ST', 'BHT', 'HL', 'NM1', 'HL', 'NM1', 'HL', 'SE', 'GE', 'IEA'];
  readonly segmentLength: Record<string, number> = {
    ISA: 16,
    GS: 8,
    ST: 3,
    BHT: 2,
    HL: 4,
    NM1: 12,
    SE: 2,
    GE: 2,
    IEA: 2,
  };
  readonly fieldMap: FieldMap<ConNom271DTO> = {
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
    senderEntityType: [{ tag: 'NM1', element: 2, occurrence: 1, mapper: entityTypeMap }], // ES: caRemitente
    receiverEntityType: [{ tag: 'NM1', element: 2, occurrence: 2, mapper: entityTypeMap }], // ES: caReceptor
    receiverTaxId: [{ tag: 'NM1', element: 9, occurrence: 2 }], // ES: nuRucReceptor
    details: {
      startTag: 'HL',
      startOccurrence: 3,
      endTag: 'SE',
      endOccurrence: 1,
      config: new ConNom271DetailConfig(),
    },
  };
}
