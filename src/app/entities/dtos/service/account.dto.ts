import { z } from 'zod';

import { AccountDMSchema } from 'src/app/entities/dms/accounts.dm';
import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

export const AccountDTOSchema = AccountDMSchema.partial().extend({
  patient: PatientDMSchema.partial().optional(),
  password: z.string().optional(),
});

export type AccountDTO = z.infer<typeof AccountDTOSchema>;
