import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const PayHealthInsuranceBodyDTOSchema = z
  .object({
    contractId: z.coerce.string().openapi({
      description: 'Id of the contract',
      example: '122038',
    }),
    commerceCode: z.string().openapi({
      description: 'Unique code for the POS',
      example: 'anyCode',
    }),
    correlative: z.string().openapi({
      description: 'Unique number of the transaction',
      example: '000000006',
    }),
    amount: z.number().openapi({
      description: 'Amount to pay',
      example: 100,
    }),
    tokenId: z.string().openapi({
      description: 'Unique code of the tokenized card',
      example: 'anyCode',
    }),
    documents: z.array(z.string()).openapi({
      description: 'Array of documentIds of the selected dues',
      example: ['122038-1-1', '122038-1-2'],
    }),
  })
  .strict()
  .openapi({
    description: 'Patient Verification Request Body',
  });

export type PayHealthInsuranceBodyDTO = z.infer<typeof PayHealthInsuranceBodyDTOSchema>;
export interface PayHealthInsuranceInputDTO {
  Body: PayHealthInsuranceBodyDTO;
}
