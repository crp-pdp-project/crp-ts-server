import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const AppointmentTypesListOutputDTOSchema = z
  .array(
    z.object({
      id: z.string().openapi({
        description: 'Unique ID of the appointment type',
        example: '3300-10010942',
      }),
      name: z.string().openapi({
        description: 'Name of the appointment type',
        example: 'CONSULTA NO PRESENCIAL',
      }),
    }),
  )
  .openapi({
    description: 'Appointment Types List Response Body',
  });

export type AppointmentTypesListOutputDTO = z.infer<typeof AppointmentTypesListOutputDTOSchema>;
