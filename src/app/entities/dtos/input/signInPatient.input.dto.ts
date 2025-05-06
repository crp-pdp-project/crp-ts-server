import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

extendZodWithOpenApi(z);

export const SignInPatientBodyDTOSchema = PatientDMSchema.pick({
  documentType: true,
  documentNumber: true,
})
  .extend({
    password: z.string().openapi({
      description: 'Password of the patient',
      example: 'ThisIsASecurePassword123',
    }),
  })
  .required()
  .openapi({
    description: 'Sign In Patient Request Body',
  });

export type SignInPatientBodyDTO = z.infer<typeof SignInPatientBodyDTOSchema>;
export interface SignInPatientInputDTO {
  Body: SignInPatientBodyDTO;
}
