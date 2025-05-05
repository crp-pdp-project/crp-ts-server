import { z } from 'zod';

import { SpecialtyDTOSchema } from 'src/app/entities/dtos/service/specialty.dto';

export const DoctorDTOSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  profileImage: z.string().optional(),
  specialty: SpecialtyDTOSchema.optional(),
});

export type DoctorDTO = z.infer<typeof DoctorDTOSchema>;
