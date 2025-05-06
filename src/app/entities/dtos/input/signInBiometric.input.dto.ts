import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

extendZodWithOpenApi(z);

export const SignInBiometricBodyDTOSchema = PatientDMSchema.pick({
  documentType: true,
  documentNumber: true,
})
  .extend({
    password: z.string().uuid().openapi({
      description: 'Biometric password of the patient as UUID',
      example: 'UUID',
    }),
  })
  .required()
  .openapi({
    description: 'Sign In Biometric Request Body',
  });

export type SignInBiometricBodyDTO = z.infer<typeof SignInBiometricBodyDTOSchema>;
export interface SignInBiometricInputDTO {
  Body: SignInBiometricBodyDTO;
}
