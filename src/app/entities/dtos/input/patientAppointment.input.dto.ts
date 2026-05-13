import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientAppointmentsParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .strict()
  .openapi({
    description: 'Get appointments path params',
  });

export type PatientAppointmentsParamsDTO = z.infer<typeof PatientAppointmentsParamsDTOSchema>;
export interface PatientAppointmentsInputDTO {
  Params: PatientAppointmentsParamsDTO;
}
