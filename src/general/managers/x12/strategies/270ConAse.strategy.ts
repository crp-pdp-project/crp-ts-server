import { FieldMap, X12ManagerConfig } from '../x12.manager';

export type ConAse270 = {
  noTransaccion?: string;
  idRemitente?: string;
  idReceptor?: string;
  feTransaccion?: string;
  hoTransaccion?: string;
  idCorrelativo?: string;
  idTransaccion?: string;
  tiFinalidad?: string;
  caRemitente?: string;
  nuRucRemitente?: string;
  txRequest?: string;
  caReceptor?: string;
  caPaciente?: string;
  apPaternoPaciente?: string;
  noPaciente?: string;
  coAfPaciente?: string;
  apMaternoPaciente?: string;
  tiDocumento?: string;
  nuDocumento?: string;
  coProducto?: string;
  deProducto?: string;
  coInProducto?: string;
  nuCobertura?: string;
  deCobertura?: string;
  caServicio?: string;
  coCalservicio?: string;
  beMaxInicial?: string;
  coTiCobertura?: string;
  coSuTiCobertura?: string;
  coAplicativoTx?: string;
  coEspecialidad?: string;
  coParentesco?: string;
  nuPlan?: string;
  nuAutOrigen?: string;
  tiAccidente?: string;
  feAccidente?: string;
  tiCaContratante?: string;
  noPaContratante?: string;
  noContratante?: string;
  noMaContratante?: string;
  tiDoContratante?: string;
  idReContratante?: string;
  coReContratante?: string;
  nuControl?: string;
  nuControlST?: string;
};

export class ConAse270Config extends X12ManagerConfig<ConAse270> {
  readonly transactionCode: Readonly<string> = '270_CON_ASE';
  readonly segmentDelimiter: string = '~';
  readonly elementDelimiter: string = '*';
  readonly subElementDelimiter: string = ':';
  readonly segmentConfig: Record<string, number> = {
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
  readonly fieldMap: Readonly<FieldMap<ConAse270>> = {
    idRemitente: [
      { tag: 'ISA', element: 6 },
      { tag: 'GS', element: 2 },
    ],
    idReceptor: [
      { tag: 'ISA', element: 8 },
      { tag: 'GS', element: 3 },
    ],
    feTransaccion: [
      { tag: 'GS', element: 4 },
      { tag: 'ISA', element: 9 },
    ],
    hoTransaccion: [
      { tag: 'GS', element: 5 },
      { tag: 'ISA', element: 10 },
    ],
    idCorrelativo: [{ tag: 'ISA', element: 13 }],
    idTransaccion: [{ tag: 'ST', element: 1 }],
    nuControl: [
      { tag: 'GS', element: 6 },
      { tag: 'GE', element: 2 },
    ],
    nuControlST: [
      { tag: 'ST', element: 2 },
      { tag: 'SE', element: 2 },
    ],
    tiFinalidad: [{ tag: 'BHT', element: 2 }],
    caRemitente: [{ tag: 'NM1', element: 2, occurrence: 1 }],
    nuRucRemitente: [{ tag: 'NM1', element: 9, occurrence: 1 }],
    txRequest: [{ tag: 'PRV', element: 3, occurrence: 1 }],
    caReceptor: [{ tag: 'NM1', element: 2, occurrence: 2 }],
    caPaciente: [{ tag: 'NM1', element: 2, occurrence: 3 }],
    apPaternoPaciente: [{ tag: 'NM1', element: 3, occurrence: 3 }],
    noPaciente: [{ tag: 'NM1', element: 4, occurrence: 3 }],
    coAfPaciente: [{ tag: 'NM1', element: 9, occurrence: 3 }],
    apMaternoPaciente: [{ tag: 'NM1', element: 12, occurrence: 3 }],
    tiDocumento: [{ tag: 'REF', element: 2, occurrence: 1 }],
    nuDocumento: [{ tag: 'REF', element: 2, occurrence: 2 }],
    coProducto: [{ tag: 'REF', element: 2, occurrence: 3 }],
    deProducto: [{ tag: 'REF', element: 3, occurrence: 3 }],
    coInProducto: [{ tag: 'REF', element: 4, component: 2, occurrence: 3 }],
    nuCobertura: [{ tag: 'REF', element: 2, occurrence: 4 }],
    deCobertura: [{ tag: 'REF', element: 3, occurrence: 4 }],
    caServicio: [{ tag: 'REF', element: 4, component: 1, occurrence: 4 }],
    coCalservicio: [{ tag: 'REF', element: 4, component: 2, occurrence: 4 }],
    beMaxInicial: [{ tag: 'REF', element: 4, component: 4, occurrence: 4 }],
    coTiCobertura: [{ tag: 'REF', element: 2, occurrence: 5 }],
    coSuTiCobertura: [{ tag: 'REF', element: 4, component: 2, occurrence: 5 }],
    coAplicativoTx: [{ tag: 'REF', element: 2, occurrence: 6 }],
    coEspecialidad: [{ tag: 'REF', element: 2, occurrence: 7 }],
    coParentesco: [{ tag: 'REF', element: 2, occurrence: 8 }],
    nuPlan: [{ tag: 'REF', element: 2, occurrence: 9 }],
    nuAutOrigen: [{ tag: 'REF', element: 4, component: 2, occurrence: 9 }],
    tiAccidente: [{ tag: 'REF', element: 2, occurrence: 10 }],
    tiDoContratante: [{ tag: 'REF', element: 2, occurrence: 11 }],
    idReContratante: [{ tag: 'REF', element: 4, component: 1, occurrence: 11 }],
    coReContratante: [{ tag: 'REF', element: 4, component: 2, occurrence: 11 }],
    feAccidente: [{ tag: 'DTP', element: 3, occurrence: 1 }],
    tiCaContratante: [{ tag: 'NM1', element: 2, occurrence: 4 }],
    noPaContratante: [{ tag: 'NM1', element: 3, occurrence: 4 }],
    noContratante: [{ tag: 'NM1', element: 4, occurrence: 4 }],
    noMaContratante: [{ tag: 'NM1', element: 12, occurrence: 4 }],
    noTransaccion: [],
  };
}
