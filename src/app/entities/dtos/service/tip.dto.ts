import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const TipDTOSchema = z.object({
  title: z.string().optional(),
  content: z.array(z.string()).optional(),
});

export type TipDTO = z.infer<typeof TipDTOSchema>;
