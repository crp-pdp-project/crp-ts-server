import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ValidateVerificationOTPBodyDTOSchema = z
  .object({
    otp: z.string().max(5).openapi({
      description: 'One Time Password sent to the user',
      example: '12345',
    }),
  })
  .openapi({
    description: 'Validate OTP Request Body',
  });

export type ValidateVerificationOTPBodyDTO = z.infer<typeof ValidateVerificationOTPBodyDTOSchema>;
export interface ValidateVerificationOTPInputDTO {
  Body: ValidateVerificationOTPBodyDTO;
}
