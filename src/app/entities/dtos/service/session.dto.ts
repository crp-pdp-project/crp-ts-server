import { z } from 'zod';

import { AccountDMSchema } from 'src/app/entities/dms/accounts.dm';
import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';
import { SessionDMSchema } from 'src/app/entities/dms/sessions.dm';
import { SessionPayloadDTOSchema } from 'src/app/entities/dtos/service/sessionPayload.dto';

export const SessionDTOSchema = SessionDMSchema.partial().extend({
  patient: PatientDMSchema.partial().nullable().optional(),
  account: AccountDMSchema.partial().nullable().optional(),
  payload: SessionPayloadDTOSchema.nullable().optional(),
});

export type SessionDTO = z.infer<typeof SessionDTOSchema>;
