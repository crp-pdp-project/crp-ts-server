import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const CancelAppointmentParamsDTOSchema = PatientDMSchema.pick({
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
    description: 'Cancel appointment request params',
  });

export type CancelAppointmentParamsDTO = z.infer<typeof CancelAppointmentParamsDTOSchema>;
export interface CancelAppointmentInputDTO {
  Params: CancelAppointmentParamsDTO;
}
