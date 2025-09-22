import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

extendZodWithOpenApi(z);

export const RelativeVerificationBodyDTOSchema = PatientDMSchema.pick({
  documentType: true,
  documentNumber: true,
})
  .strict()
  .openapi({
    description: 'Relative Verification Request Body',
  });

export type RelativeVerificationBodyDTO = z.infer<typeof RelativeVerificationBodyDTOSchema>;
export interface RelativeVerificationInputDTO {
  Body: RelativeVerificationBodyDTO;
}
