import { z } from 'zod';

import { AuthAttemptDMSchema } from 'src/app/entities/dms/authAttempts.dm';

export const AuthAttemptDTOSchema = AuthAttemptDMSchema.partial();

export type AuthAttemptDTO = z.infer<typeof AuthAttemptDTOSchema>;
