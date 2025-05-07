import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const InsurancesListOutputDTOSchema = z
  .object({
    insurances: z.array(
      z.object({
        id: z.string().openapi({
          description: 'Unique ID of the insurance',
          example: '16260',
        }),
        inspectionId: z.string().openapi({
          description: 'Unique inspection ID of the insurance',
          example: '99',
        }),
        name: z.string().openapi({
          description: 'Name of the insurance',
          example: '24DR',
        }),
      }),
    ),
  })
  .openapi({
    description: 'Insurances List Response Body',
  });

export type InsurancesListOutputDTO = z.infer<typeof InsurancesListOutputDTOSchema>;
