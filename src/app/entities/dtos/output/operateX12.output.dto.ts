import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const OperateX12OutputDTOSchema = z
  .object({
    decodedPayload: z.record(z.string(), z.unknown()).optional(),
    encodedPayload: z.string().optional(),
  })
  .openapi({
    description: 'Operate X12 response body',
  });

export type OperateX12OutputDTO = z.infer<typeof OperateX12OutputDTOSchema>;
