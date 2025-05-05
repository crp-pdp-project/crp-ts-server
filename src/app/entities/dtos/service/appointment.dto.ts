import { z } from 'zod';

import { AppointmentTypeDTOSchema } from 'src/app/entities/dtos/service/appointmentType.dto';
import { DoctorDTOSchema } from 'src/app/entities/dtos/service/doctor.dto';
import { InsuranceDTOSchema } from 'src/app/entities/dtos/service/insurance.dto';
import { SpecialtyDTOSchema } from 'src/app/entities/dtos/service/specialty.dto';

export const AppointmentDTOSchema = z.object({
  id: z.string().optional(),
  episodeId: z.string().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
  doctor: DoctorDTOSchema.pick({
    id: true,
    name: true,
  }).optional(),
  specialty: SpecialtyDTOSchema.optional(),
  insurance: InsuranceDTOSchema.optional(),
  appointmentType: AppointmentTypeDTOSchema.optional(),
  canCancel: z.boolean().optional(),
  canReprogram: z.boolean().optional(),
  didShow: z.boolean().optional(),
});

export type AppointmentDTO = z.infer<typeof AppointmentDTOSchema>;
