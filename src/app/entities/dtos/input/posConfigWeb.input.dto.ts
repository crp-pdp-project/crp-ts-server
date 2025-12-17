import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const POSConfigWebBodyDTOSchema = z
  .object({
    amount: z.number().openapi({
      description: 'Amount to pay',
      example: 132.65,
    }),
  })
  .strict()
  .openapi({
    description: 'POS Config Web Request Body',
  });

export type POSConfigWebBodyDTO = z.infer<typeof POSConfigWebBodyDTOSchema>;
export interface POSConfigWebInputDTO {
  Body: POSConfigWebBodyDTO;
}
