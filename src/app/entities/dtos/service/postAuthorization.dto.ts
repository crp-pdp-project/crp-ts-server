import { z } from 'zod';

export const POSAuthorizationDTOSchema = z.object({
  purchaseNumber: z.string(),
  amount: z.number(),
  currency: z.string().optional(),
  tokenId: z.string(),
  email: z.email().nullable().optional(),
  commerceCode: z.string(),
});

export type POSAuthorizationDTO = z.infer<typeof POSAuthorizationDTOSchema>;
