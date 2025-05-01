import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const SpecialtyDTOSchema = z.object({
  id: z.string().optional().openapi({
    description: 'Unique ID of the specialty',
    example: '2600',
  }),
  name: z.string().optional().openapi({
    description: 'Name of the specialty',
    example: 'Cardiologia',
  }),
});

export type SpecialtyDTO = z.infer<typeof SpecialtyDTOSchema>;
