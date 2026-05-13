import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { Months } from 'src/general/helpers/date.helper';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientResultsListParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .strict()
  .openapi({
    description: 'Patient results list path params',
  });

export const PatientResultsListQueryDTOSchema = z
  .object({
    year: z.coerce.number().openapi({
      description: 'Year to filter the results',
      example: 2025,
    }),
    month: z.coerce.number().pipe(z.enum(Months)).optional().openapi({
      description: 'Month to filter the results',
      example: Months.Jan,
    }),
  })
  .strict()
  .openapi({
    description: 'Patient results list query strings',
  });

export type PatientResultsListParamsDTO = z.infer<typeof PatientResultsListParamsDTOSchema>;
export type PatientResultsListQueryDTO = z.infer<typeof PatientResultsListQueryDTOSchema>;
export interface PatientResultsListInputDTO {
  Params: PatientResultsListParamsDTO;
  Query: PatientResultsListQueryDTO;
}
