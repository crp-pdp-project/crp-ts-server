import { ConNom271DetailDTO } from 'src/app/entities/dtos/service/conNom271Detail.dto';

import { FieldMap, X12ManagerConfig } from '../x12.manager';

export class ConNom271DetailConfig implements X12ManagerConfig<ConNom271DetailDTO> {
  readonly segmentDelimiter: string = '~';
  readonly elementDelimiter: string = '*';
  readonly componentDelimiter: string = ':';
  readonly segmentSequence: string[] = ['NM1', 'REF', 'REF', 'REF', 'REF', 'REF', 'REF', 'DMG', 'NM1', 'REF'];
  readonly segmentLength: Record<string, number> = {
    NM1: 12,
    REF: 4,
    DMG: 5,
  };
  readonly fieldMap: FieldMap<ConNom271DetailDTO> = {
    patientEntityType: [{ tag: 'NM1', element: 2, occurrence: 1 }],
    patientLastName: [{ tag: 'NM1', element: 3, occurrence: 1 }],
    patientFirstName: [{ tag: 'NM1', element: 4, occurrence: 1 }],
    patientMemberId: [{ tag: 'NM1', element: 9, occurrence: 1 }],
    patientMaternalLastName: [{ tag: 'NM1', element: 12, occurrence: 1 }],
    patientStatusCode: [{ tag: 'REF', element: 2, occurrence: 1 }],
    patientDocumentType: [{ tag: 'REF', element: 2, occurrence: 2 }],
    patientDocumentNumber: [{ tag: 'REF', element: 4, component: 2, occurrence: 2 }],
    patientContractNumber: [{ tag: 'REF', element: 2, occurrence: 3 }],
    productCode: [{ tag: 'REF', element: 2, occurrence: 4 }],
    productDescription: [{ tag: 'REF', element: 3, occurrence: 4 }],
    sctrNumber: [{ tag: 'REF', element: 4, component: 2, occurrence: 4 }],
    relationshipCode: [{ tag: 'REF', element: 2, occurrence: 5 }],
    planNumber: [{ tag: 'REF', element: 2, occurrence: 6 }],
    birthDate: [{ tag: 'DMG', element: 2, occurrence: 1 }],
    gender: [{ tag: 'DMG', element: 3, occurrence: 1 }],
    maritalStatus: [{ tag: 'DMG', element: 4, occurrence: 1 }],
    contractorEntityType: [{ tag: 'NM1', element: 2, occurrence: 2 }],
    contractorLastName: [{ tag: 'NM1', element: 3, occurrence: 2 }],
    contractorFirstName: [{ tag: 'NM1', element: 4, occurrence: 2 }],
    contractorMaternalLastName: [{ tag: 'NM1', element: 12, occurrence: 2 }],
    contractorDocumentType: [{ tag: 'REF', element: 2, occurrence: 7 }],
    contractorIdQualifier: [{ tag: 'REF', element: 4, component: 1, occurrence: 7 }],
    contractorId: [{ tag: 'REF', element: 4, component: 2, occurrence: 7 }],
  };
}
