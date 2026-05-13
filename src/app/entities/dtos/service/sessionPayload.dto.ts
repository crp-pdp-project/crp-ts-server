import { z } from 'zod';

import { AccountDMSchema } from '../../dms/accounts.dm';
import { DeviceDMSchema } from '../../dms/devices.dm';
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
      createdAt: true,
    })
      .partial()
      .extend({
        account: AccountDMSchema.pick({ id: true }).partial().optional(),
        device: DeviceDMSchema.pick({ id: true }).partial().optional(),
      })
      .optional(),
    external: z
      .object({
        email: z.email().nullable(),
        phone: z.coerce.string().nullable(),
      })
      .optional(),
  })
  .strict();

export type SessionPayloadDTO = z.infer<typeof SessionPayloadDTOSchema>;
