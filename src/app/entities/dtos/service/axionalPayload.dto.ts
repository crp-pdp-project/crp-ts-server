import { z } from 'zod';

import { PatientDocumentType } from 'src/general/enums/patientInfo.enum';

export const AxionalPayloadDTOSchema = z.object({
  ipressId: z.string(),
  iafaId: z.string(),
  date: z.string(),
  time: z.string(),
  patientEntityType: z.string(),
  patientLastName: z.string(),
  patientFirstName: z.string(),
  patientMemberId: z.string(),
  patientSecondLastName: z.string().nullable().optional(),
  patientDocumentType: z.string(),
  patientDocumentNumber: z.string(),
  clientLastName: z.string(),
  clientFirstName: z.string(),
  clientSecondLastName: z.string().nullable().optional(),
  clientDocumentType: z.enum(PatientDocumentType),
  clientDocumentNumber: z.string(),
  productCode: z.string(),
  productDescription: z.string(),
  contractorEntityType: z.string(),
  contractorFirstName: z.string(),
  contractorDocumentType: z.string(),
  contractorIdQualifier: z.string(),
  contractorId: z.string(),
  coverageTypeCode: z.string(),
  coverageSubtypeCode: z.string(),
  currencyCode: z.string(),
  copayFixed: z.number(),
  serviceCalcCode: z.string(),
  serviceCalcQuantity: z.number(),
  copayVariable: z.number(),
  taxAmount: z.number(),
  preTaxAmount: z.number(),
});

export type AxionalPayloadDTO = z.infer<typeof AxionalPayloadDTOSchema>;
