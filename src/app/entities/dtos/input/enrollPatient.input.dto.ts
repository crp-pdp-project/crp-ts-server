import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

extendZodWithOpenApi(z);

export const EnrollPatientBodyDTOSchema = PatientDMSchema.pick({
  documentType: true,
  documentNumber: true,
  birthDate: true,
})
  .required()
  .openapi({
    description: 'Enroll Patient Request Body',
  });

export type EnrollPatientBodyDTO = z.infer<typeof EnrollPatientBodyDTOSchema>;
export interface EnrollPatientInputDTO {
  Body: EnrollPatientBodyDTO;
}
