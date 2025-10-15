import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const EmployeeSessionDMSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique ID of the session',
    example: 1,
  }),
  username: z.string().openapi({
    description: 'Username of the employee',
    example: 'PRUEBA',
  }),
  jti: z.string().openapi({
    description: 'Unique Identifier of the JWT',
    example: 'AnyJTI',
  }),
  expiresAt: z.string().openapi({
    description: 'Expiration date of the session in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  createdAt: z.string().openapi({
    description: 'Creation date of the session in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  updatedAt: z.string().openapi({
    description: 'Last update of the session in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
});

export type EmployeeSessionDM = z.infer<typeof EmployeeSessionDMSchema>;
