import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientVerificationBodyDTOSchema = PatientDMSchema.pick({
  documentType: true,
  documentNumber: true,
  birthDate: true,
})
  .required()
  .openapi({
    description: 'Patient Verification Request Body',
  });

export type PatientVerificationBodyDTO = z.infer<typeof PatientVerificationBodyDTOSchema>;
export interface PatientVerificationInputDTO {
  Body: PatientVerificationBodyDTO;
}
