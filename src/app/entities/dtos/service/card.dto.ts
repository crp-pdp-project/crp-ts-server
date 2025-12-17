import { z } from 'zod';

export const CardDTOSchema = z.object({
  errorCode: z.number().optional(),
  errorMessage: z.string().optional(),
  header: z.object({
    ecoreTransactionUUID: z.string().optional(),
    ecoreTransactionDate: z.number().optional(),
    millis: z.number().optional(),
  }),
  card: z.object({
    cardNumber: z.string().optional(),
    brand: z.string().optional(),
    expirationMonth: z.string().optional(),
    expirationYear: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
  order: z.object({
    transactionToken: z.string().optional(),
    purchaseNumber: z.number().optional(),
    amount: z.number().optional(),
    currency: z.string().optional(),
    actionCode: z.string().optional(),
    actionDescription: z.string().optional(),
    status: z.string().optional(),
    traceNumber: z.string().optional(),
    transactionDate: z.string().optional(),
    transactionId: z.string().optional(),
  }),
  token: z.object({
    tokenId: z.string().optional(),
    ownerId: z.string().optional(),
    expireOn: z.string().optional(),
  }),
});

export type CardDTO = z.infer<typeof CardDTOSchema>;
