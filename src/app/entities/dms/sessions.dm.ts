import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const SessionDMSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique ID of the session',
    example: 1,
  }),
  patientId: z.number().int().positive().openapi({
    description: 'Unique ID of the patient',
    example: 1,
  }),
  jti: z.string().openapi({
    description: 'Unique Identifier of the JWT',
    example: 'AnyJTI',
  }),
  otp: z.coerce.string().max(6).nullable().openapi({
    description: 'One Time Password for an specific flow',
    example: '123456',
  }),
  otpSendCount: z.number().int().nullable().openapi({
    description: 'Number of times an OTP was sended per session',
    example: 1,
  }),
  isValidated: z.boolean().default(false).openapi({
    description: 'Is the one time password validated',
    example: false,
  }),
  expiresAt: z.string().openapi({
    description: 'Expiration date of the session in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  createdAt: z.string().openapi({
    description: 'Creation date of the session in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  updatedAt: z.string().openapi({
    description: 'Last update of the session in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
});

export type SessionDM = z.infer<typeof SessionDMSchema>;
