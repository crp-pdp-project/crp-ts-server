import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const AvailabilityListQueryDTOSchema = z
  .object({
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
      example: '16435',
    }),
    inspectionId: z.coerce.string().openapi({
      description: 'Id of the insurance inspection to filter',
      example: '99',
    }),
  })
  .strict()
  .openapi({
    description: 'Appointment types appointment query strings',
  });

export type AvailabilityListQueryDTO = z.infer<typeof AvailabilityListQueryDTOSchema>;
export interface AvailabilityListInputDTO {
  Querystring: AvailabilityListQueryDTO;
}
