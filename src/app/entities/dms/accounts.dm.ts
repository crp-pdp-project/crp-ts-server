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
    description: 'Hashed Passowrd of the patient',
    example: 'AnyHash',
  }),
  passwordSalt: z.string().openapi({
    description: 'Salt using for the hashing of the patients password',
    example: 'AnySalt',
  }),
  biometricHash: z.string().nullable().openapi({
    description: 'Hashed biometricUUID of the patient',
    example: 'AnyHash',
  }),
  biometricSalt: z.string().nullable().openapi({
    description: 'Salt using for the hashing of the patients biometric UUID',
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
  blockExpiredAt: z.string().nullable().openapi({
    description: 'Account blocked until the provided date in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  tryCount: z.number().int().nullable().openapi({
    description: 'Failed logging attempts, if 3 is reached the account is going to be blocked for 1 hour',
    example: 1,
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
