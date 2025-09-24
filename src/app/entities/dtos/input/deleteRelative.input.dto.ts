import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const DeleteRelativeParamsDTOSchema = z
  .object({
    relativeId: z.coerce.number().positive().openapi({
      description: 'Unique ID of the relative',
      example: 1,
    }),
  })
  .strict()
  .openapi({
    description: 'Cancel appointment request params',
  });

export type DeleteRelativeParamsDTO = z.infer<typeof DeleteRelativeParamsDTOSchema>;
export interface DeleteRelativeInputDTO {
  Params: DeleteRelativeParamsDTO;
}
