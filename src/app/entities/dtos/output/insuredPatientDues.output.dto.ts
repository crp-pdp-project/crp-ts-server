import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const InsuredPatientDuesOutputDTOSchema = z
  .object({
    name: z.string().openapi({
      description: 'Name of the insured patient',
      example: 'Renato',
    }),
    contractId: z.coerce.string().openapi({
      description: 'Id of the contract',
      example: '122038',
    }),
    sections: z
      .array(
        z.object({
          title: z.string().openapi({
            description: 'Title of the sections',
            example: 'Pago Mensual',
          }),
          dues: z.array(
            z.object({
              id: z.string().openapi({
                description: 'Unique ID of the due',
                example: '122038-1-12',
              }),
              dueDate: z.string().openapi({
                description: 'Due expire date in DD-MM-YYYY format',
                example: '01-01-2025',
              }),
              isOverdue: z.boolean().openapi({
                description: 'Is the due expired',
                example: false,
              }),
              amount: z.number().openapi({
                description: 'Amount to pay for the due',
                example: 132.65,
              }),
              dueNumber: z.number().openapi({
                description: 'Order number for this due',
                example: 12,
              }),
              version: z.number().openapi({
                description: 'Version of the contract the due belongs to',
                example: 1,
              }),
            }),
          ),
        }),
      )
      .openapi({
        description: 'List of yearly pay dues',
      }),
  })
  .strict()
  .openapi({
    description: 'Insured Patient Dues Response Body',
  });

export type InsuredPatientDuesOutputDTO = z.infer<typeof InsuredPatientDuesOutputDTOSchema>;
