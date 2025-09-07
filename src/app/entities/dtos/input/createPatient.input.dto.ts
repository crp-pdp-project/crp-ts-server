import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDocumentType, PatientGender } from 'src/general/enums/patientInfo.enum';

extendZodWithOpenApi(z);

export const CreatePatientBodyDTOSchema = z
  .object({
    firstName: z.string().openapi({
      description: 'First Name of the patient',
      example: 'Renato',
    }),
    lastName: z.string().openapi({
      description: 'Last Name of the patient',
      example: 'Berrocal',
    }),
    secondLastName: z.string().optional().openapi({
      description: 'Last Name of the patient',
      example: 'Vignolo',
    }),
    birthDate: z.string().openapi({
      description: 'Birth Date of the patient in DD-MM-YYYY',
      example: '01-01-2025',
    }),
    documentNumber: z.string().min(8).openapi({
      description: 'Document number of the patient',
      example: '88888888',
    }),
    documentType: z.enum(PatientDocumentType).openapi({
      description: 'Type of document of the patient',
      example: PatientDocumentType.DNI,
    }),
    gender: z.enum(PatientGender).openapi({
      description: 'Type of document of the patient',
      example: PatientGender.MALE,
    }),
    email: z.email().optional().openapi({
      description: 'Email of the patient if available',
      example: 'email@email.com',
    }),
    phone: z.string().optional().openapi({
      description: 'Phone of the patient if available',
      example: '999999999',
    }),
  })
  .strict()
  .openapi({
    description: 'Enroll Patient Response Body',
  });

export type CreatePatientBodyDTO = z.infer<typeof CreatePatientBodyDTOSchema>;
export interface CreatePatientInputDTO {
  Body: CreatePatientBodyDTO;
}
