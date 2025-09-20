import { z } from 'zod';

import { AccountDMSchema } from '../../dms/accounts.dm';
import { DeviceDMSchema } from '../../dms/devices.dm';
import { PatientDMSchema } from '../../dms/patients.dm';

export const SignInSessionPayloadDTOSchema = z
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
    }).extend({
      account: AccountDMSchema.pick({ id: true }),
      device: DeviceDMSchema.pick({ id: true }),
    }),
  })
  .strict();

export type SignInSessionPayloadDTO = z.infer<typeof SignInSessionPayloadDTOSchema>;
