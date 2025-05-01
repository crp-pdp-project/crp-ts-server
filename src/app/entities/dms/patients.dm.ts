import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const PatientDMSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique ID of the patient',
    example: 1,
  }),
  fmpId: z.string().openapi({
    description: 'Unique FMP ID of the patient',
    example: '1',
  }),
  nhcId: z.string().openapi({
    description: 'Unique NHC ID of the patient',
    example: '1',
  }),
  firstName: z.string().openapi({
    description: 'First Name of the patient',
    example: 'Renato',
  }),
  lastName: z.string().openapi({
    description: 'Last Name of the patient',
    example: 'Berrocal',
  }),
  secondLastName: z.string().nullable().openapi({
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
  documentType: z.number().int().positive().openapi({
    description: 'Type of document of the patient',
    example: 14,
  }),
  createdAt: z.string().openapi({
    description: 'Creation date of the patient in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  updatedAt: z.string().openapi({
    description: 'Last update of the patient in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
});

export type PatientDM = z.infer<typeof PatientDMSchema>;
