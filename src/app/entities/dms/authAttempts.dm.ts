import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { AuthFlowIdentifier } from 'src/general/enums/flowIdentifier.enum';
extendZodWithOpenApi(z);

export const AuthAttemptsDMSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique ID of the authAttempt',
    example: 1,
  }),
  documentNumber: z.string().min(8).openapi({
    description: 'Document number of the patient',
    example: '88888888',
  }),
  flowIdentifier: z.nativeEnum(AuthFlowIdentifier).openapi({
    description: 'Unique Identifier of the flow',
    example: AuthFlowIdentifier.SING_IN,
  }),
  blockExpiredAt: z.string().nullable().openapi({
    description: 'Attempt blocked until the provided date in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  tryCount: z.number().int().nullable().openapi({
    description: 'Failed logging attempts, if 3 is reached the account is going to be blocked for 1 hour',
    example: 1,
  }),
  tryCountExpiredAt: z.string().nullable().openapi({
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

export type AuthAttemptsDM = z.infer<typeof AuthAttemptsDMSchema>;
