import { ConCod271DetailDTO } from 'src/app/entities/dtos/service/conCod271Detail.dto';

import { coverageTypeMap } from '../maps/coverageType.map';
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
    benefitInfo: [{ tag: 'EB', element: 1, occurrence: 1 }], // ES: coInfoBeneficio
    coverageNumber: [{ tag: 'EB', element: 5, occurrence: 1 }], // ES: nuCobertura
    initialMaxBenefit: [{ tag: 'EB', element: 7, occurrence: 1 }], // ES: beMaxInicial
    coverageAmount: [{ tag: 'EB', element: 8, occurrence: 1 }], // ES: imCobertura
    restrictionIndicatorCode: [{ tag: 'EB', element: 9, occurrence: 1 }], // ES: coIndicadorRestriccion
    serviceQuantity: [{ tag: 'EB', element: 10, occurrence: 1 }], // ES: nuCantidadServicio
    productId: [{ tag: 'EB', element: 13, component: 2, occurrence: 1 }], // ES: idProducto
    coverageTypeCode: [{ tag: 'REF', element: 2, occurrence: 1, mapper: coverageTypeMap }], // ES: coTiCobertura
    coverageSubtypeCode: [{ tag: 'REF', element: 4, component: 2, occurrence: 1 }], // ES: coSuTiCobertura
    notesMessage: [{ tag: 'MSG', element: 1, occurrence: 1 }], // ES: txNotas
    specialConditionsMessage: [{ tag: 'MSG', element: 1, occurrence: 2 }], // ES: txCondicionesEspeciales
    currencyCode: [{ tag: 'EB', element: 5, occurrence: 2 }], // ES: coMoneda
    copayFixed: [{ tag: 'EB', element: 7, occurrence: 2 }], // ES: imCopagoFijo
    serviceCalcCode: [{ tag: 'EB', element: 9, occurrence: 2 }], // ES: coCalculoServicio
    serviceCalcQuantity: [{ tag: 'EB', element: 10, occurrence: 2 }], // ES: nuCalculoServicio
    copayVariable: [{ tag: 'EB', element: 8, occurrence: 3 }], // ES: imCopagoVariable
    guaranteeFlag: [{ tag: 'EB', element: 1, occurrence: 4 }], // ES: inGarantia
    guaranteeFlagDetail: [{ tag: 'EB', element: 5, occurrence: 4 }], // ES: deGarantia
    waitingPeriodEndDate: [{ tag: 'DTP', element: 3, occurrence: 1 }], // ES: feFinCarencia
    eliminationPeriodEndDate: [{ tag: 'DTP', element: 3, occurrence: 2 }], // ES: feFinEliminacion
  };
}
