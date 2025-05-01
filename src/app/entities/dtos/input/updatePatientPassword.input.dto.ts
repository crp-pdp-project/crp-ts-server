import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const UpdatePatientPasswordBodyDTOSchema = z
  .object({
    password: z.string().openapi({
      description: 'New password of the enrolled patient',
      example: 'ThisIsASecurePassword123',
    }),
  })
  .openapi({
    description: 'Create Password Request Body',
  });

export type UpdatePatientPasswordBodyDTO = z.infer<typeof UpdatePatientPasswordBodyDTOSchema>;
export interface UpdatePatientPasswordInputDTO {
  Body: UpdatePatientPasswordBodyDTO;
}
