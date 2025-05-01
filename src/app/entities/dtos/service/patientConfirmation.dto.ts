import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';
extendZodWithOpenApi(z);

export const PatientConfirmationDTOSchema = PatientDMSchema.pick({
  fmpId: true,
}).extend({
  confirmInCenter: z.boolean().openapi({
    description: 'Should the patient be confirmed on center',
    example: false,
  }),
});

export type PatientConfirmationDTO = z.infer<typeof PatientConfirmationDTOSchema>;
