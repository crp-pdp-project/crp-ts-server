import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const RelationshipDMSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique ID of the relationship',
    example: 1,
  }),
  name: z.string().openapi({
    description: 'Name of the relationship',
    example: 'Hijo/a',
  }),
  createdAt: z.string().openapi({
    description: 'Creation date of the family in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  updatedAt: z.string().openapi({
    description: 'Last update of the family in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
});

export type RelationshipDM = z.infer<typeof RelationshipDMSchema>;
