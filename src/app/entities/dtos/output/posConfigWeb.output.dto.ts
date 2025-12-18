import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);
export const POSConfigWebOutputDTOSchema = z
  .object({
    commerceCode: z.string().openapi({
      description: 'Unique code for the POS',
      example: 'anyCode',
    }),
    correlative: z.string().openapi({
      description: 'Unique number of the transaction',
      example: '000000006',
    }),
    sessionToken: z.string().openapi({
      description: 'Session token of the POS',
      example: 'anyToken',
    }),
    token: z.string().openapi({
      description: 'Token of the POS',
      example: 'anyToken',
    }),
    env: z.string().openapi({
      description: 'Environment of the POS config',
      example: 'dev',
    }),
  })
  .strip()
  .openapi({
    description: 'POS Config Web Response Body',
  });

export type POSConfigWebOutputDTO = z.infer<typeof POSConfigWebOutputDTOSchema>;
