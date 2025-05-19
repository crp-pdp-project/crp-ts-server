import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientNextAppointmentParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .strict()
  .openapi({
    description: 'Get next appointment path params',
  });

export type PatientNextAppointmentParamsDTO = z.infer<typeof PatientNextAppointmentParamsDTOSchema>;
export interface PatientNextAppointmentInputDTO {
  Params: PatientNextAppointmentParamsDTO;
}
