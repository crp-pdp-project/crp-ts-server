import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientProfileOutputDTOSchema = PatientDMSchema.pick({
  id: true,
  fmpId: true,
  nhcId: true,
  firstName: true,
  lastName: true,
  secondLastName: true,
  documentNumber: true,
  documentType: true,
})
  .extend({
    email: z.coerce.string().email().nullable().openapi({
      description: 'Email of the patient if available',
      example: 'email@email.com',
    }),
    maskedEmail: z.coerce.string().nullable().openapi({
      description: 'Masked email of the patient if available',
      example: '**ail@email.com',
    }),
    phone: z.coerce.string().nullable().openapi({
      description: 'Phone of the patient if available',
      example: '999999999',
    }),
    maskedPhone: z.coerce.string().nullable().openapi({
      description: 'Masked phone of the patient if available',
      example: '******999',
    }),
  })
  .openapi({
    description: 'Patient Profile Response Body',
  });

export type PatientProfileOutputDTO = z.infer<typeof PatientProfileOutputDTOSchema>;
