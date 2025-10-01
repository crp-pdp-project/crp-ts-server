import { z } from 'zod';

import { AppointmentTypeDTOSchema } from './appointmentType.dto';
import { DoctorDTOSchema } from './doctor.dto';
import { SpecialtyDTOSchema } from './specialty.dto';

export const AppointmentDocumentDTOSchema = z.object({
  documentId: z.string().optional(),
  episodeId: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  centerId: z.string().optional(),
  doctor: DoctorDTOSchema.pick({ name: true }).optional(),
  specialty: SpecialtyDTOSchema.pick({ name: true }).optional(),
  appointmentType: AppointmentTypeDTOSchema.pick({ name: true }).optional(),
  type: z.string().optional(),
  documentCategory: z.string().optional(),
});

export type AppointmentDocumentDTO = z.infer<typeof AppointmentDocumentDTOSchema>;
