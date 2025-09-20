import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const AppointmentTypesListQueryDTOSchema = z
  .object({
    doctorId: z.coerce.string().openapi({
      description: 'Id of the doctor to filter',
      example: '44789755',
    }),
    specialtyId: z.coerce.string().openapi({
      description: 'Id of the specialty to filter',
      example: '900',
    }),
    insuranceId: z.coerce.string().openapi({
      description: 'Id of the insurance to filter',
      example: '16023',
    }),
  })
  .strict()
  .openapi({
    description: 'Appointment types appointment query strings',
  });

export type AppointmentTypesListQueryDTO = z.infer<typeof AppointmentTypesListQueryDTOSchema>;
export interface AppointmentTypesListInputDTO {
  Querystring: AppointmentTypesListQueryDTO;
}
