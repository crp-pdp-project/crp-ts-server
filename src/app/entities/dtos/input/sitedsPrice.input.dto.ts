import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const SitedsPriceParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .strict()
  .openapi({
    description: 'Siteds prices path params',
  });

export const SitedsPriceBodyDTOSchema = z
  .object({
    iafaId: z.coerce.string().openapi({
      description: 'Iafa Id of the insurance',
      example: '20001',
    }),
    correlative: z.coerce.string().openapi({
      description: 'Correlative of the transaction',
      example: '000000006',
    }),
  })
  .strict()
  .openapi({
    description: 'Siteds prices request body',
  });

export type SitedsPriceBodyDTO = z.infer<typeof SitedsPriceBodyDTOSchema>;
export type SitedsPriceParamsDTO = z.infer<typeof SitedsPriceParamsDTOSchema>;
export interface SitedsPriceInputDTO {
  Params: SitedsPriceParamsDTO;
  Body: SitedsPriceBodyDTO;
}
