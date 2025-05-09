import { z } from 'zod';

export const DoctorAvailabilityDTOSchema = z.object({
  specialtyId: z.string(),
  doctorId: z.string(),
  appointmentTypeId: z.string(),
  scheduleId: z.string(),
  blockId: z.string(),
  date: z.string(),
  time: z.string(),
});

export type DoctorAvailabilityDTO = z.infer<typeof DoctorAvailabilityDTOSchema>;
