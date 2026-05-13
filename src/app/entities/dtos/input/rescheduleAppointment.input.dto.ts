import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const RescheduleAppointmentParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .extend({
    appointmentId: z.string().openapi({
      description: 'Unique ID of the appointment',
      example: 'C202335563796',
    }),
  })
  .strict()
  .openapi({
    description: 'Reschedule appointment path params',
  });

export const RescheduleAppointmentBodyDTOSchema = z
  .object({
    specialtyId: z.coerce.string().openapi({
      description: 'Id of the specialty',
      example: '900',
    }),
    doctorId: z.coerce.string().openapi({
      description: 'Id of the doctor',
      example: '44789755',
    }),
    appointmentTypeId: z.coerce.string().openapi({
      description: 'Id of the appointmentType',
      example: '900-10010020',
    }),
    scheduleId: z.string().openapi({
      description: 'Schedule ID of the slot',
      example: 'CRP_CardFC',
    }),
    blockId: z.string().openapi({
      description: 'Block ID of the slot',
      example: 'Tar: __XJ__ (Mar-Dic25)',
    }),
    date: z.string().openapi({
      description: 'Appointment schedule date in DD-MM-YYYY HH:mm:ss',
      example: '01-01-2025 00:00:00',
    }),
  })
  .strict()
  .openapi({
    description: 'Reschedule appointment request body',
  });

export type RescheduleAppointmentBodyDTO = z.infer<typeof RescheduleAppointmentBodyDTOSchema>;
export type RescheduleAppointmentParamsDTO = z.infer<typeof RescheduleAppointmentParamsDTOSchema>;
export interface RescheduleAppointmentInputDTO {
  Params: RescheduleAppointmentParamsDTO;
  Body: RescheduleAppointmentBodyDTO;
}
