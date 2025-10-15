import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const SignInEmployeeBodyDTOSchema = z
  .object({
    username: z.string().openapi({
      description: 'Username of the employee',
      example: 'PRUEBA',
    }),
    password: z.string().openapi({
      description: 'Password of the employee',
      example: 'PRUEBA',
    }),
  })
  .strict()
  .openapi({
    description: 'Sign In Employee Request Body',
  });

export type SignInEmployeeBodyDTO = z.infer<typeof SignInEmployeeBodyDTOSchema>;
export interface SignInEmployeeInputDTO {
  Body: SignInEmployeeBodyDTO;
}
