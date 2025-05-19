import { z } from 'zod';

export const AppointmentRequestDTOSchema = z.object({
  specialtyId: z.string(),
  doctorId: z.string(),
  appointmentTypeId: z.string(),
  insuranceId: z.string(),
  inspectionId: z.string(),
  scheduleId: z.string(),
  blockId: z.string(),
  fmpId: z.string(),
  date: z.string(),
});

export type AppointmentRequestDTO = z.infer<typeof AppointmentRequestDTOSchema>;
