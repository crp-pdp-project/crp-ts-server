import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const AddDeviceBiometricPasswordBodyDTOSchema = z
  .object({
    password: z.string().openapi({
      description: 'New password of the device',
      example: 'anyUUID',
    }),
  })
  .strict()
  .openapi({
    description: 'Add devoce biometric password Request Body',
  });

export type AddDeviceBiometricPasswordBodyDTO = z.infer<typeof AddDeviceBiometricPasswordBodyDTOSchema>;
export interface AddDeviceBiometricPasswordInputDTO {
  Body: AddDeviceBiometricPasswordBodyDTO;
}
