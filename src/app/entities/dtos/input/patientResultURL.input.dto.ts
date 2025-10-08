import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientResultURLParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .strict()
  .openapi({
    description: 'Get patient result url request params',
  });

export const PatientResultURLBodyDTOSchema = z
  .object({
    accessNumber: z.string().openapi({
      description: 'Access number of the result',
      example: 'CLIRPC2437451050',
    }),
    gidenpac: z.string().openapi({
      description: 'Gidenpac code of the patient',
      example: '733480',
    }),
    specialtyName: z.string().openapi({
      description: 'Name of the specialty',
      example: 'Cardiologia',
    }),
    appointmentTypeName: z.string().openapi({
      description: 'Name of the appointment type',
      example: 'CONSULTA NO PRESENCIAL',
    }),
  })
  .strict()
  .openapi({
    description: 'Get patient result url request body',
  });

export type PatientResultURLParamsDTO = z.infer<typeof PatientResultURLParamsDTOSchema>;
export type PatientResultURLBodyDTO = z.infer<typeof PatientResultURLBodyDTOSchema>;
export interface PatientResultURLInputDTO {
  Params: PatientResultURLParamsDTO;
  Body: PatientResultURLBodyDTO;
}
