import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientResultPDFParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .extend({
    resultId: z.string().openapi({
      description: 'Unique ID of the result',
      example: 'C202335563796',
    }),
  })
  .strict()
  .openapi({
    description: 'Get patient result pdf request params',
  });

export type PatientResultPDFParamsDTO = z.infer<typeof PatientResultPDFParamsDTOSchema>;
export interface PatientResultPDFInputDTO {
  Params: PatientResultPDFParamsDTO;
}
