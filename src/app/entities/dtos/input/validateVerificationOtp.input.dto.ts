import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ConfirmVerificationOTPBodyDTOSchema = z
  .object({
    otp: z.string().max(5).openapi({
      description: 'One Time Password sent to the user',
      example: '12345',
    }),
  })
  .strict()
  .openapi({
    description: 'Validate OTP Request Body',
  });

export type ConfirmVerificationOTPBodyDTO = z.infer<typeof ConfirmVerificationOTPBodyDTOSchema>;
export interface ConfirmVerificationOTPInputDTO {
  Body: ConfirmVerificationOTPBodyDTO;
}
