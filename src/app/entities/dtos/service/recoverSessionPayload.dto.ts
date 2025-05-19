import { z } from 'zod';

import { AccountDMSchema } from '../../dms/accounts.dm';
import { PatientDMSchema } from '../../dms/patients.dm';

export const RecoverSessionPayloadDTOSchema = z
  .object({
    patient: PatientDMSchema.pick({
      id: true,
      fmpId: true,
      nhcId: true,
      documentNumber: true,
      documentType: true,
      firstName: true,
      lastName: true,
    }).extend({
      account: AccountDMSchema.pick({ id: true }),
    }),
    external: z.object({
      email: z.string().email().nullable(),
      phone: z.coerce.string().nullable(),
    }),
  })
  .strict();

export type RecoverSessionPayloadDTO = z.infer<typeof RecoverSessionPayloadDTOSchema>;
