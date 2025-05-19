import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientCurrentAppointmentsParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .strict()
  .openapi({
    description: 'List historic appointments path params',
  });

export type PatientCurrentAppointmentsParamsDTO = z.infer<typeof PatientCurrentAppointmentsParamsDTOSchema>;
export interface PatientCurrentAppointmentsInputDTO {
  Params: PatientCurrentAppointmentsParamsDTO;
}
