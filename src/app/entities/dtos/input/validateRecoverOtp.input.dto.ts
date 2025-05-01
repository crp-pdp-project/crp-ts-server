import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ValidateRecoverOTPBodyDTOSchema = z
  .object({
    otp: z.string().max(5).openapi({
      description: 'One Time Password sent to the user',
      example: '12345',
    }),
  })
  .openapi({
    description: 'Validate Enroll OTP Request Body',
  });

export type ValidateRecoverOTPBodyDTO = z.infer<typeof ValidateRecoverOTPBodyDTOSchema>;
export interface ValidateRecoverOTPInputDTO {
  Body: ValidateRecoverOTPBodyDTO;
}
