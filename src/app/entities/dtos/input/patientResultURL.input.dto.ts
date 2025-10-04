import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientResultURLParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .extend({
    accessNumber: z.string().openapi({
      description: 'Access number of the result',
      example: 'CLIRPC2437451050',
    }),
  })
  .strict()
  .openapi({
    description: 'Get patient result url request params',
  });

export type PatientResultURLParamsDTO = z.infer<typeof PatientResultURLParamsDTOSchema>;
export interface PatientResultURLInputDTO {
  Params: PatientResultURLParamsDTO;
}
