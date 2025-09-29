import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { ConNom271DTOSchema } from '../service/conNom271.dto';

extendZodWithOpenApi(z);
// TODO SITEDS OUTPUT SCHEMA
export const SitedsPriceOutputDTOSchema = z
  .object({
    data: ConNom271DTOSchema,
  })
  .strict()
  .openapi({
    description: 'Siteds Price Response Body',
  });

export type SitedsPriceOutputDTO = z.infer<typeof SitedsPriceOutputDTOSchema>;
