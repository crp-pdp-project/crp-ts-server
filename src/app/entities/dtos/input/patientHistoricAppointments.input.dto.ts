import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const PatientHistoricAppointmentsQueryDTOSchema = z
  .object({
    monthsToList: z.coerce.number().int().positive().max(25).default(1).openapi({
      description: 'Number of months into the past to be listed (max 25), if not provided 1 is used by default.',
      example: 1,
    }),
  })
  .openapi({
    description: 'Patient Historic appointment query strings',
  });

export type PatientHistoricAppointmentsQueryDTO = z.infer<typeof PatientHistoricAppointmentsQueryDTOSchema>;
export interface PatientHistoricAppointmentsInputDTO {
  Querystring: PatientHistoricAppointmentsQueryDTO;
}
