import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const RelativeVerificationOutputDTOSchema = z
  .object({
    id: z.number().int().positive().openapi({
      description: 'Unique ID of the new patient',
      example: 1,
    }),
    firstName: z.string().openapi({
      description: 'First Name of the patient',
      example: 'Renato',
    }),
    lastName: z.string().openapi({
      description: 'Last Name of the patient',
      example: 'Berrocal',
    }),
    email: z.email().nullable().openapi({
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
  })
  .strict()
  .openapi({
    description: 'Relative verification Response Body',
  });

export type RelativeVerificationOutputDTO = z.infer<typeof RelativeVerificationOutputDTOSchema>;
