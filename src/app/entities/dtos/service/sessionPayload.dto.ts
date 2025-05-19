import { z } from 'zod';

import { AccountDMSchema } from '../../dms/accounts.dm';
import { PatientDMSchema } from '../../dms/patients.dm';

export const SessionPayloadDTOSchema = z
  .object({
    patient: PatientDMSchema.pick({
      id: true,
      fmpId: true,
      nhcId: true,
      documentNumber: true,
      documentType: true,
      firstName: true,
      lastName: true,
    })
      .partial()
      .extend({
        account: AccountDMSchema.pick({ id: true }).partial().optional(),
      })
      .optional(),
    external: z
      .object({
        email: z.string().email().nullable(),
        phone: z.coerce.string().nullable(),
      })
      .optional(),
  })
  .strict();

export type SessionPayloadDTO = z.infer<typeof SessionPayloadDTOSchema>;
