import { z } from 'zod';

export const POSConfigDTOSchema = z.object({
  user: z.string().optional(),
  password: z.string().optional(),
  commerceCode: z.string().optional(),
  channel: z.string().optional(),
  host: z.string().optional(),
  MDDList: z.string().optional(),
  correlative: z.number().optional(),
  token: z.string().optional(),
  environment: z.string().optional(),
  pinHash: z.string().optional(),
});

export type POSConfigDTO = z.infer<typeof POSConfigDTOSchema>;
