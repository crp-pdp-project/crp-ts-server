import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientHistoricAppointmentsParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .strict()
  .openapi({
    description: 'List historic appointments path params',
  });

export type PatientHistoricAppointmentsParamsDTO = z.infer<typeof PatientHistoricAppointmentsParamsDTOSchema>;
export interface PatientHistoricAppointmentsInputDTO {
  Params: PatientHistoricAppointmentsParamsDTO;
}
