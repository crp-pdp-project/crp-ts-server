import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const CreateAppointmentParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .strict()
  .openapi({
    description: 'Create appointment path params',
  });

export const CreateAppointmentBodyDTOSchema = z
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
    insuranceId: z.coerce.string().openapi({
      description: 'Id of the insurance',
      example: '16435',
    }),
    inspectionId: z.coerce.string().openapi({
      description: 'Id of the insurance inspection',
      example: '99',
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
    description: 'Create appointment request body',
  });

export type CreateAppointmentBodyDTO = z.infer<typeof CreateAppointmentBodyDTOSchema>;
export type CreateAppointmentParamsDTO = z.infer<typeof CreateAppointmentParamsDTOSchema>;
export interface CreateAppointmentInputDTO {
  Params: CreateAppointmentParamsDTO;
  Body: CreateAppointmentBodyDTO;
}
