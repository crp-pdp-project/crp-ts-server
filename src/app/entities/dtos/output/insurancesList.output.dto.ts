import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { InsuranceTypes } from 'src/general/enums/insuranceType.enum';

extendZodWithOpenApi(z);
export const InsurancesListOutputDTOSchema = z
  .object({
    insurances: z.array(
      z.object({
        id: z.string().openapi({
          description: 'Unique ID of the insurance',
          example: '16004',
        }),
        inspectionId: z.string().openapi({
          description: 'Unique Inspection ID of the insurance',
          example: '99',
        }),
        iafaId: z.string().openapi({
          description: 'Unique Iafa ID of the insurance',
          example: '40005',
        }),
        fasId: z.string().openapi({
          description: 'Unique fas ID of the insurance',
          example: '00041488',
        }),
        name: z.string().openapi({
          description: 'Name of the insurance',
          example: 'LA POSITIVA SEGUROS Y REASEGUROS',
        }),
        type: z.enum(InsuranceTypes).openapi({
          description: 'Type of the insurance',
          example: InsuranceTypes.SITEDS,
        }),
      }),
    ),
  })
  .strip()
  .openapi({
    description: 'Insurances List Response Body',
  });

export type InsurancesListOutputDTO = z.infer<typeof InsurancesListOutputDTOSchema>;
