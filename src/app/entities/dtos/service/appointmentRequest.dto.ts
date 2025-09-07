import { z } from 'zod';

export const AppointmentRequestDTOSchema = z.object({
  appointmentId: z.string().optional(),
  specialtyId: z.string(),
  doctorId: z.string(),
  appointmentTypeId: z.string(),
  insuranceId: z.string().optional(),
  inspectionId: z.string().optional(),
  scheduleId: z.string(),
  blockId: z.string(),
  fmpId: z.string(),
  date: z.string(),
});

export type AppointmentRequestDTO = z.infer<typeof AppointmentRequestDTOSchema>;
