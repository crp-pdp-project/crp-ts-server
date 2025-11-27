import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const PayHealthInsuranceBodyDTOSchema = z
  .object({
    contractId: z.coerce.string().openapi({
      description: 'Id of the contract',
      example: '123124',
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
    documents: z
      .array(
        z.object({
          id: z.string().openapi({
            description: 'Unique ID of the due',
            example: '123124-1-12',
          }),
          amount: z.number().openapi({
            description: 'Amount to pay for the due',
            example: 132.65,
          }),
        }),
      )
      .openapi({
        description: 'Array of selected dues',
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
