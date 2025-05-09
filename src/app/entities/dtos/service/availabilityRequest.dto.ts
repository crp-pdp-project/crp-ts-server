import { z } from 'zod';

export const AvailabilityRequestDTOSchema = z.object({
  groupId: z.string(),
  doctorId: z.string(),
  appointmentTypeId: z.string(),
  insuranceId: z.string(),
  inspectionId: z.string(),
  fmpId: z.string(),
  firstAvailable: z.boolean().default(false),
});

export type AvailabilityRequestDTO = z.infer<typeof AvailabilityRequestDTOSchema>;
