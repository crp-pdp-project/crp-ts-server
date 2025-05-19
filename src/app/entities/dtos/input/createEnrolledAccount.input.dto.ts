import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const CreateEnrolledAccountBodyDTOSchema = z
  .object({
    password: z.string().openapi({
      description: 'New password of the enrolled patient',
      example: 'ThisIsASecurePassword123',
    }),
    acceptTerms: z.boolean().openapi({
      description: 'The patient accepted the terms & conditions',
      example: true,
    }),
    acceptAdvertising: z.boolean().openapi({
      description: 'The patient accept to receive advertiising',
      example: true,
    }),
  })
  .strict()
  .openapi({
    description: 'Create Password Request Body',
  });

export type CreateEnrolledAccountBodyDTO = z.infer<typeof CreateEnrolledAccountBodyDTOSchema>;
export interface CreateEnrolledAccountInputDTO {
  Body: CreateEnrolledAccountBodyDTO;
}
