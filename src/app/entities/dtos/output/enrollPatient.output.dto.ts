import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const EnrollPatientOutputDTOSchema = z
  .object({
    patientEnroll: z.object({
      id: z.number().int().positive().openapi({
        description: 'Unique ID of the new patient',
        example: 1,
      }),
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
    }),
    token: z.coerce.string().openapi({
      description: 'JWE Token for enroll session',
      example: 'Valid JWE',
    }),
  })
  .openapi({
    description: 'Enroll Patient Response Body',
  });

export type EnrollPatientOutputDTO = z.infer<typeof EnrollPatientOutputDTOSchema>;
