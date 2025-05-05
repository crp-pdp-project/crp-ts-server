import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

export const PatientConfirmationDTOSchema = PatientDMSchema.pick({
  fmpId: true,
}).extend({
  confirmInCenter: z.boolean(),
});

export type PatientConfirmationDTO = z.infer<typeof PatientConfirmationDTOSchema>;
