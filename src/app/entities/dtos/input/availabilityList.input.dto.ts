import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const AvailabilityListQueryDTOSchema = z
  .object({
    groupId: z.coerce.string().openapi({
      description: 'Id of the specialty group to filter',
      example: '26',
    }),
    doctorId: z.coerce.string().openapi({
      description: 'Id of the doctor to filter',
      example: '70358611',
    }),
    appointmentTypeId: z.coerce.string().openapi({
      description: 'Id of the appointmentType to filter',
      example: '3300-10010942',
    }),
    insuranceId: z.coerce.string().openapi({
      description: 'Id of the insurance to filter',
      example: '16260',
    }),
    inspectionId: z.coerce.string().openapi({
      description: 'Id of the insurance inspection to filter',
      example: '99',
    }),
  })
  .openapi({
    description: 'Appointment types appointment query strings',
  });

export type AvailabilityListQueryDTO = z.infer<typeof AvailabilityListQueryDTOSchema>;
export interface AvailabilityListInputDTO {
  Querystring: AvailabilityListQueryDTO;
}
