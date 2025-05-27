import { z } from 'zod';

import { AuthAttemptsDMSchema } from '../../dms/authAttempts.dm';

export const AuthAttemptsDTOSchema = AuthAttemptsDMSchema.partial();

export type AuthAttemptsDTO = z.infer<typeof AuthAttemptsDTOSchema>;
