import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

extendZodWithOpenApi(z);

export const RecoverPasswordBodyDTOSchema = PatientDMSchema.pick({
  documentType: true,
  documentNumber: true,
  birthDate: true,
})
  .required()
  .openapi({
    description: 'Enroll Patient Request Body',
  });

export type RecoverPasswordBodyDTO = z.infer<typeof RecoverPasswordBodyDTOSchema>;
export interface RecoverPasswordInputDTO {
  Body: RecoverPasswordBodyDTO;
}
