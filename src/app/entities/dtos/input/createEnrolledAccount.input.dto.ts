import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const CreateEnrolledAccountBodyDTOSchema = z
  .object({
    password: z.string().openapi({
      description: 'New password of the enrolled patient',
      example: 'ThisIsASecurePassword123',
    }),
  })
  .openapi({
    description: 'Create Password Request Body',
  });

export type CreateEnrolledAccountBodyDTO = z.infer<typeof CreateEnrolledAccountBodyDTOSchema>;
export interface CreateEnrolledAccountInputDTO {
  Body: CreateEnrolledAccountBodyDTO;
}
