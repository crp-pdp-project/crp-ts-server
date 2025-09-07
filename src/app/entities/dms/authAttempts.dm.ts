import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { AuthFlowIdentifier } from '../models/authAttempt/authAttempt.model';

extendZodWithOpenApi(z);

export const AuthAttemptDMSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique ID of the auth attempt',
    example: 1,
  }),
  documentNumber: z.string().min(8).openapi({
    description: 'Document number of the patient',
    example: '88888888',
  }),
  flowIdentifier: z.enum(AuthFlowIdentifier).openapi({
    description: 'Unique Identifier of the flow',
    example: AuthFlowIdentifier.SIGN_IN,
  }),
  blockExpiresAt: z.string().nullable().openapi({
    description: 'Attempt blocked until the provided date in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  tryCount: z.number().int().nullable().openapi({
    description: 'Failed logging attempts, if 3 is reached the account is going to be blocked for 1 hour',
    example: 1,
  }),
  tryCountExpiresAt: z.string().nullable().openapi({
    description: 'Attempt try count valid until the provided date in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  createdAt: z.string().openapi({
    description: 'Creation date of the auth attempt in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  updatedAt: z.string().openapi({
    description: 'Last update of the auth attempt in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
});

export type AuthAttemptDM = z.infer<typeof AuthAttemptDMSchema>;
