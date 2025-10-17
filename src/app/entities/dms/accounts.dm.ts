import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const AccountDMSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique ID of the account',
    example: 1,
  }),
  patientId: z.number().int().positive().openapi({
    description: 'Unique ID of the patient',
    example: 1,
  }),
  passwordHash: z.string().openapi({
    description: 'Hashed Password of the patient',
    example: 'AnyHash',
  }),
  passwordSalt: z.string().openapi({
    description: 'Salt using for the hashing of the patients password',
    example: 'AnySalt',
  }),
  acceptTerms: z.boolean().openapi({
    description: 'The patient accepted the terms & conditions',
    example: true,
  }),
  acceptAdvertising: z.boolean().openapi({
    description: 'The patient accept to receive advertiising',
    example: true,
  }),
  createdAt: z.string().openapi({
    description: 'Creation date of the account in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  updatedAt: z.string().openapi({
    description: 'Last update of the account in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
});

export type AccountDM = z.infer<typeof AccountDMSchema>;
