import { z } from 'zod';

export const AppointmentCreateDTOSchema = z.object({
  id: z.string().nullable().optional(),
  errorCode: z.number(),
});

export type AppointmentCreateDTO = z.infer<typeof AppointmentCreateDTOSchema>;
