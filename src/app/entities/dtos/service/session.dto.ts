import { z } from 'zod';

import { SessionDMSchema } from 'src/app/entities/dms/sessions.dm';

export const SessionDTOSchema = SessionDMSchema.partial();

export type SessionDTO = z.infer<typeof SessionDTOSchema>;
