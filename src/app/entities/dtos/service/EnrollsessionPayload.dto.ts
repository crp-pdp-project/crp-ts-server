import { z } from 'zod';

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
    }),
    external: z.object({
      email: z.string().email().nullable(),
      phone: z.coerce.string().nullable(),
    }),
  })
  .strict();

export type EnrollSessionPayloadDTO = z.infer<typeof EnrollSessionPayloadDTOSchema>;
