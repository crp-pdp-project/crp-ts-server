import { ConCod271DetailDTO } from 'src/app/entities/dtos/service/conCod271Detail.dto';

import { FieldMap, X12ManagerConfig } from '../x12.manager';

export class ConCod271DetailConfig implements X12ManagerConfig<ConCod271DetailDTO> {
  readonly segmentDelimiter: string = '~';
  readonly elementDelimiter: string = '*';
  readonly componentDelimiter: string = ':';
  readonly segmentSequence: string[] = ['EB', 'REF', 'MSG', 'MSG', 'EB', 'EB', 'EB', 'DTP', 'DTP'];
  readonly segmentLength: Record<string, number> = {
    EB: 13,
    REF: 4,
    MSG: 2,
    DTP: 3,
  };
  readonly fieldMap: FieldMap<ConCod271DetailDTO> = {
    benefitInfo: [{ tag: 'EB', element: 1, occurrence: 1 }],
    coverageNumber: [{ tag: 'EB', element: 5, occurrence: 1 }],
    initialMaxBenefit: [{ tag: 'EB', element: 7, occurrence: 1 }],
    coverageAmount: [{ tag: 'EB', element: 8, occurrence: 1 }],
    restrictionIndicatorCode: [{ tag: 'EB', element: 9, occurrence: 1 }],
    serviceQuantity: [{ tag: 'EB', element: 10, occurrence: 1 }],
    productId: [{ tag: 'EB', element: 13, component: 2, occurrence: 1 }],
    coverageTypeCode: [{ tag: 'REF', element: 2, occurrence: 1 }],
    coverageSubtypeCode: [{ tag: 'REF', element: 4, component: 2, occurrence: 1 }],
    notesMessage: [{ tag: 'MSG', element: 1, occurrence: 1 }],
    specialConditionsMessage: [{ tag: 'MSG', element: 1, occurrence: 2 }],
    currencyCode: [{ tag: 'EB', element: 5, occurrence: 2 }],
    copayFixed: [{ tag: 'EB', element: 7, occurrence: 2 }],
    serviceCalcCode: [{ tag: 'EB', element: 9, occurrence: 2 }],
    serviceCalcQuantity: [{ tag: 'EB', element: 10, occurrence: 2 }],
    copayVariable: [{ tag: 'EB', element: 8, occurrence: 3 }],
    guaranteeFlag: [{ tag: 'EB', element: 1, occurrence: 4 }],
    guaranteeFlagDetail: [{ tag: 'EB', element: 5, occurrence: 4 }],
    waitingPeriodEndDate: [{ tag: 'DTP', element: 3, occurrence: 1 }],
    eliminationPeriodEndDate: [{ tag: 'DTP', element: 3, occurrence: 2 }],
  };
}
