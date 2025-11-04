import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientsListParamsDTOSchema = PatientDMSchema.pick({
  id: true,
})
  .strict()
  .openapi({
    description: 'List patients path params',
  });

export const PatientsListQueryDTOSchema = z
  .object({
    search: z.string().optional().openapi({
      description: 'Search by FullName or DocumentNumber',
      example: 'Renato',
    }),
    cursor: z.coerce.number().optional().openapi({
      description: 'Next cursor to paginate',
      example: 1,
    }),
    limit: z.coerce.number().optional().default(50).openapi({
      description: 'Number of items to return, 50 by default',
      example: 50,
    }),
  })
  .strict()
  .openapi({
    description: 'List patients query strings',
  });

export type PatientsListParamsDTO = z.infer<typeof PatientsListParamsDTOSchema>;
export type PatientsListQueryDTO = z.infer<typeof PatientsListQueryDTOSchema>;
export interface PatientsListInputDTO {
  Params: PatientsListParamsDTO;
  Query: PatientsListQueryDTO;
}
