import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

import { AccountDMSchema } from 'src/app/entities/dms/accounts.dm';
import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

export const AccountDTOSchema = AccountDMSchema.partial().extend({
  patient: PatientDMSchema.partial().optional().openapi({
    description: 'Information of the patient',
  }),
});

export type AccountDTO = z.infer<typeof AccountDTOSchema>;
