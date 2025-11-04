import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PatientsListOutputDTOSchema = z
  .object({
    list: z.array(PatientDMSchema),
    hasNext: z.boolean().openapi({
      description: 'The list has a next page',
      example: true,
    }),
    nextCursor: z.number().int().positive().nullable().openapi({
      description: 'Next cursor to be used',
      example: 1,
    }),
  })
  .strip()
  .openapi({
    description: 'Patient List Response Body',
  });

export type PatientsListOutputDTO = z.infer<typeof PatientsListOutputDTOSchema>;
