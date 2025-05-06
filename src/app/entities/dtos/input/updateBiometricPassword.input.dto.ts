import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const UpdateBiometricPasswordBodyDTOSchema = z
  .object({
    password: z.string().uuid().openapi({
      description: 'New biometric password of the patient as UUID',
      example: 'UUID',
    }),
  })
  .openapi({
    description: 'Create Biometric Password Request Body',
  });

export type UpdateBiometricPasswordBodyDTO = z.infer<typeof UpdateBiometricPasswordBodyDTOSchema>;
export interface UpdateBiometricPasswordInputDTO {
  Body: UpdateBiometricPasswordBodyDTO;
}
