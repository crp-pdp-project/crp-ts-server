import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

export const PatientLegalGuardianDTOSchema = PatientDMSchema.pick({
  firstName: true,
  lastName: true,
  secondLastName: true,
  documentNumber: true,
  documentType: true,
})
  .partial()
  .extend({
    legalGuardianId: z.coerce.string().optional(),
    email: z.email().nullable().optional(),
    phone: z.coerce.string().nullable().optional(),
  });

export type PatientLegalGuardianDTO = z.infer<typeof PatientLegalGuardianDTOSchema>;
