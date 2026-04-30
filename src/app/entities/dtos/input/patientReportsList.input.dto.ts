import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientReportGroup } from 'src/general/enums/patientReportType.enum';
import { Months } from 'src/general/helpers/date.helper';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientReportsListParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .strict()
  .openapi({
    description: 'Patient reports list path params',
  });

export const PatientReportsListQueryDTOSchema = z
  .object({
    group: z.enum(PatientReportGroup).optional().default(PatientReportGroup.RESULTS).openapi({
      description: 'group of reports to list results by default',
      example: PatientReportGroup.RESULTS,
    }),
    year: z.coerce.number().openapi({
      description: 'Year to filter the reports',
      example: 2025,
    }),
    month: z.coerce.number().pipe(z.enum(Months)).optional().openapi({
      description: 'Month to filter the reports',
      example: Months.Jan,
    }),
  })
  .strict()
  .openapi({
    description: 'Patient reports list query strings',
  });

export type PatientReportsListParamsDTO = z.infer<typeof PatientReportsListParamsDTOSchema>;
export type PatientReportsListQueryDTO = z.infer<typeof PatientReportsListQueryDTOSchema>;
export interface PatientReportsListInputDTO {
  Params: PatientReportsListParamsDTO;
  Query: PatientReportsListQueryDTO;
}
