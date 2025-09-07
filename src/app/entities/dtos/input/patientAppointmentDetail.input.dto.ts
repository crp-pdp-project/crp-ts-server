import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientAppointmentDetailParamsDTOSchema = PatientDMSchema.pick({
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
    description: 'Get appointments path params',
  });

export type PatientAppointmentDetailParamsDTO = z.infer<typeof PatientAppointmentDetailParamsDTOSchema>;
export interface PatientAppointmentDetailInputDTO {
  Params: PatientAppointmentDetailParamsDTO;
}
