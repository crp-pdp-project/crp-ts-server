import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);
export const POSConfigOutputDTOSchema = z
  .object({
    user: z.string().openapi({
      description: 'User to authenticate with the POS',
      example: 'anyUser',
    }),
    password: z.string().openapi({
      description: 'Password to authenticate with the POS',
      example: 'anyPassword',
    }),
    commerceCode: z.string().openapi({
      description: 'Unique code for the POS',
      example: 'anyCode',
    }),
    host: z.string().openapi({
      description: 'Host of the POS',
      example: 'https://anyHost.com',
    }),
    certificatedHost: z.string().openapi({
      description: 'Host of the POS without protocol',
      example: 'https://anyHost.com',
    }),
    env: z.string().openapi({
      description: 'Environment of the POS config',
      example: 'dev',
    }),
    correlative: z.string().openapi({
      description: 'Unique number of the transaction',
      example: '000000006',
    }),
    email: z.email().openapi({
      description: 'Email of the patient, default test@crp.com.pe',
      example: 'test@crp.com.pe',
    }),
    token: z.string().openapi({
      description: 'Token of the POS',
      example: 'anyToken',
    }),
    pinHash: z.string().openapi({
      description: 'Pin hash of the POS',
      example: 'anyToken',
    }),
    MDD: z
      .object({
        MDD4: z.string().optional(),
        MDD21: z.number().optional(),
        MDD32: z.string().optional(),
        MDD75: z.string().optional(),
        MDD77: z.number().optional(),
      })
      .openapi({
        description: 'All MDD needed for the POS',
        example: { MDD21: 0 },
      }),
  })
  .strip()
  .openapi({
    description: 'POS Config Response Body',
  });

export type POSConfigOutputDTO = z.infer<typeof POSConfigOutputDTOSchema>;
