import { z } from 'zod';

export const ConNom271DetailDTOSchema = z.object({
  patientEntityType: z.string().optional(),
  patientLastName: z.string().optional(),
  patientFirstName: z.string().optional(),
  patientMemberId: z.string().optional(),
  patientMaternalLastName: z.string().optional(),
  patientStatusCode: z.string().optional(),
  patientDocumentType: z.string().optional(),
  patientDocumentNumber: z.string().optional(),
  patientContractNumber: z.string().optional(),
  productCode: z.string().optional(),
  productDescription: z.string().optional(),
  sctrNumber: z.string().optional(),
  relationshipCode: z.string().optional(),
  planNumber: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  contractorEntityType: z.string().optional(),
  contractorLastName: z.string().optional(),
  contractorFirstName: z.string().optional(),
  contractorMaternalLastName: z.string().optional(),
  contractorDocumentType: z.string().optional(),
  contractorIdQualifier: z.string().optional(),
  contractorId: z.string().optional(),
});

export type ConNom271DetailDTO = z.infer<typeof ConNom271DetailDTOSchema>;
