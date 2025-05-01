import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const AppointmentTypeDTOSchema = z.object({
  id: z.string().optional().openapi({
    description: 'Unique ID of the appointment type',
    example: '3300-10010942',
  }),
  name: z.string().optional().openapi({
    description: 'Name of the appointment type',
    example: '(ONC) CONSULTA NO PRESENCIAL (VIDEOCONFERENCIA) (ONCOLOGÍA MÉDICA) (500101) (ONCOLOGÍA MÉDICA)',
  }),
});

export type AppointmentTypeDTO = z.infer<typeof AppointmentTypeDTOSchema>;
