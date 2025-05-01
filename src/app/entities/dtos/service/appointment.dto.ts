import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { AppointmentTypeDTOSchema } from 'src/app/entities/dtos/service/appointmentType.dto';
import { DoctorDTOSchema } from 'src/app/entities/dtos/service/doctor.dto';
import { InsuranceDTOSchema } from 'src/app/entities/dtos/service/insurance.dto';
import { SpecialtyDTOSchema } from 'src/app/entities/dtos/service/specialty.dto';
extendZodWithOpenApi(z);

export const AppointmentDTOSchema = z.object({
  id: z.string().optional().openapi({
    description: 'Unique ID of the appointment',
    example: '3300-10010942',
  }),
  date: z.string().optional().openapi({
    description: 'Appointment schedule date in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  mode: z.string().optional().openapi({
    description: 'Appointment mode',
    example: 'Presencial',
  }),
  status: z.number().optional().openapi({
    description: 'Appointment status, either 1 2 or 3. By default 1 is sent',
    example: 1,
  }),
  doctor: DoctorDTOSchema.pick({
    id: true,
    name: true,
  })
    .optional()
    .openapi({
      description: 'Doctor model',
    }),
  specialty: SpecialtyDTOSchema.optional().openapi({
    description: 'Specialty model',
  }),
  insurance: InsuranceDTOSchema.optional().openapi({
    description: 'insurance model',
  }),
  appointmentType: AppointmentTypeDTOSchema.optional().openapi({
    description: 'Appointment type model',
  }),
});

export type AppointmentDTO = z.infer<typeof AppointmentDTOSchema>;
