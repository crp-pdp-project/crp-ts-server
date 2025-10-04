import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);
export const PatientResultURLOutputDTOSchema = z
  .object({
    url: z.string().openapi({
      description: 'Authenticated url to access images',
      example: 'https://anyHost.com',
    }),
  })
  .strict()
  .openapi({
    description: 'Patient result url Response Body',
  });

export type PatientResultURLOutputDTO = z.infer<typeof PatientResultURLOutputDTOSchema>;
