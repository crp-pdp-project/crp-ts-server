import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const SpecialtyDTOSchema = z.object({
  id: z.string().optional(),
  groupId: z.string().optional(),
  name: z.string().optional(),
});

export type SpecialtyDTO = z.infer<typeof SpecialtyDTOSchema>;
