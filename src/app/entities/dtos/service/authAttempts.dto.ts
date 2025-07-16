import { z } from 'zod';

import { AuthAttemptDMSchema } from 'src/app/entities/dms/authAttempts.dm';

export const AuthAttemptsDTOSchema = AuthAttemptDMSchema.partial();

export type AuthAttemptsDTO = z.infer<typeof AuthAttemptsDTOSchema>;
