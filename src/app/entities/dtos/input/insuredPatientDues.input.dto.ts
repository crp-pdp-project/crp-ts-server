import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const InsuredPatientDuesParamsDTOSchema = z
  .object({
    contractId: z.coerce.string().openapi({
      description: 'Id of the contract',
      example: '122038',
    }),
  })
  .strict()
  .openapi({
    description: 'Insured patient dues params',
  });

export type InsuredPatientDuesParamsDTO = z.infer<typeof InsuredPatientDuesParamsDTOSchema>;
export interface InsuredPatientDuesInputDTO {
  Params: InsuredPatientDuesParamsDTO;
}
