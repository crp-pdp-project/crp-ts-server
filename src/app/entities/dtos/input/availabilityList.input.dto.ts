import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { AvailabilityFilters } from 'src/general/enums/availabilityFilters.enum';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const AvailabilityListQueryDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .extend({
    groupId: z.coerce.string().openapi({
      description: 'Id of the specialty group to filter',
      example: '9',
    }),
    doctorId: z.coerce.string().openapi({
      description: 'Id of the doctor to filter',
      example: '44789755',
    }),
    appointmentTypeId: z.coerce.string().openapi({
      description: 'Id of the appointmentType to filter',
      example: '900-10010020',
    }),
    insuranceId: z.coerce.string().openapi({
      description: 'Id of the insurance to filter',
      example: '16023',
    }),
    inspectionId: z.coerce.string().openapi({
      description: 'Id of the insurance inspection to filter',
      example: '99',
    }),
    date: z.coerce.string().optional().openapi({
      description: 'Month and year to filter calendar availability in MM-YYYY',
      example: '01-2026',
    }),
    filter: z.enum(AvailabilityFilters).optional().default(AvailabilityFilters.ALL).openapi({
      description: 'Type of filtering applied to the list, just one month or all records',
      example: AvailabilityFilters.ALL,
    }),
  })
  .strict()
  .openapi({
    description: 'Doctors availability query strings',
  });

export type AvailabilityListQueryDTO = z.infer<typeof AvailabilityListQueryDTOSchema>;
export interface AvailabilityListInputDTO {
  Querystring: AvailabilityListQueryDTO;
}
