import { z } from 'zod';

import { SpecialtyDTOSchema } from 'src/app/entities/dtos/service/specialty.dto';

import { DoctorAvailabilityDTOSchema } from './doctorAvailability.dto';

export const DoctorDTOSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  profileImage: z.string().nullable().optional(),
  specialty: SpecialtyDTOSchema.optional(),
  availability: z.array(DoctorAvailabilityDTOSchema).optional(),
});

export type DoctorDTO = z.infer<typeof DoctorDTOSchema>;
