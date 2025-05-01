import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { AccountDMSchema } from 'src/app/entities/dms/accounts.dm';
import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';
import { SessionDMSchema } from 'src/app/entities/dms/sessions.dm';
import { SessionPayloadDTOSchema } from 'src/app/entities/dtos/service/sessionPayload.dto';

extendZodWithOpenApi(z);

export const SessionDTOSchema = SessionDMSchema.partial().extend({
  patient: PatientDMSchema.partial().nullable().optional().openapi({
    description: 'Patient model information',
  }),
  account: AccountDMSchema.partial().nullable().optional().openapi({
    description: 'Account model information',
  }),
  payload: SessionPayloadDTOSchema.nullable().optional().openapi({
    description: 'Payload of the decoded token',
  }),
});

export type SessionDTO = z.infer<typeof SessionDTOSchema>;
