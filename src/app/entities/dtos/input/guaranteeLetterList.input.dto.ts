import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const GuaranteeLetterListParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .strict()
  .openapi({
    description: 'Guarantee letter list path params',
  });

export type GuaranteeLetterListParamsDTO = z.infer<typeof GuaranteeLetterListParamsDTOSchema>;
export interface GuaranteeLetterListInputDTO {
  Params: GuaranteeLetterListParamsDTO;
}
