import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { X12Formats, X12Operations } from 'src/general/enums/x12.enum';

extendZodWithOpenApi(z);

export const OperateX12ParamsDTOSchema = z
  .object({
    operation: z.enum(X12Operations).openapi({
      description: 'Operation to execute',
      example: X12Operations.ENCODE,
    }),
    format: z.enum(X12Formats).openapi({
      description: 'Format to execute',
      example: X12Formats.CON_ASE,
    }),
  })
  .strict()
  .openapi({
    description: 'Operate X12 params',
  });

export const OperateX12BodyDTOSchema = z
  .object({
    payload: z.string().or(z.record(z.string(), z.unknown())),
  })

  .openapi({
    description: 'Operate X12 body',
  });

export type OperateX12ParamsDTO = z.infer<typeof OperateX12ParamsDTOSchema>;
export type OperateX12BodyDTO = z.infer<typeof OperateX12BodyDTOSchema>;
export interface OperateX12InputDTO {
  Params: OperateX12ParamsDTO;
  Body: OperateX12BodyDTO;
}
