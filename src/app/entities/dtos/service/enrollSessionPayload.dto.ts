import { z } from 'zod';

import { DeviceDMSchema } from '../../dms/devices.dm';
import { PatientDMSchema } from '../../dms/patients.dm';

export const EnrollSessionPayloadDTOSchema = z
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
      device: DeviceDMSchema.pick({ id: true }),
    }),
    external: z.object({
      email: z.email().nullable(),
      phone: z.coerce.string().nullable(),
    }),
  })
  .strict();

export type EnrollSessionPayloadDTO = z.infer<typeof EnrollSessionPayloadDTOSchema>;
