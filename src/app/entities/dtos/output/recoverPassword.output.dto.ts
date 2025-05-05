import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const RecoverPasswordOutputDTOSchema = z
  .object({
    patientRecover: z.object({
      id: z.number().int().positive().openapi({
        description: 'Unique ID of the patient',
        example: 1,
      }),
      email: z.string().email().nullable().openapi({
        description: 'Email of the patient if available',
        example: 'email@email.com',
      }),
      maskedEmail: z.string().nullable().openapi({
        description: 'Masked email of the patient if available',
        example: '**ail@email.com',
      }),
      phone: z.string().nullable().openapi({
        description: 'Phone of the patient if available',
        example: '999999999',
      }),
      maskedPhone: z.string().nullable().openapi({
        description: 'Masked phone of the patient if available',
        example: '******999',
      }),
    }),
    token: z.string().openapi({
      description: 'JWE Token for enroll session',
      example: 'Valid JWE',
    }),
  })
  .openapi({
    description: 'Enroll Patient Response Body',
  });

export type RecoverPasswordOutputDTO = z.infer<typeof RecoverPasswordOutputDTOSchema>;
