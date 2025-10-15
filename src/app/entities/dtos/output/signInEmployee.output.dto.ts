import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const SignInEmployeeOutputDTOSchema = z
  .object({
    employee: z.object({
      username: z.string().openapi({
        description: 'Username of the employee',
        example: 'PRUEBA',
      }),
      internalUsername: z.string().nullable().openapi({
        description: 'Username used internally for the employee',
        example: 'PRUEBA',
      }),
      name: z.string().nullable().openapi({
        description: 'Name of the employee',
        example: 'Prueba',
      }),
    }),
    token: z.string().openapi({
      description: 'JWE Token for enroll session',
      example: 'Valid JWE',
    }),
  })
  .strict()
  .openapi({
    description: 'Sign In Employee Response Body',
  });

export type SignInEmployeeOutputDTO = z.infer<typeof SignInEmployeeOutputDTOSchema>;
