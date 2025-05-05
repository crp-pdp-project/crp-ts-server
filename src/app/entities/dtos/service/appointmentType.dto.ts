import { z } from 'zod';

export const AppointmentTypeDTOSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
});

export type AppointmentTypeDTO = z.infer<typeof AppointmentTypeDTOSchema>;
