import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const OperateRelativeParamsDTOSchema = z
  .object({
    patientId: z.coerce.number().positive().openapi({
      description: 'Unique ID of the patient',
      example: 1,
    }),
    relativeId: z.coerce.number().positive().openapi({
      description: 'Unique ID of the relative',
      example: 1,
    }),
  })
  .strict()
  .openapi({
    description: 'Verify relative request params',
  });

export type OperateRelativeParamsDTO = z.infer<typeof OperateRelativeParamsDTOSchema>;
export interface OperateRelativeInputDTO {
  Params: OperateRelativeParamsDTO;
}
