import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const FamilyDMSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique ID of the family',
    example: 1,
  }),
  principalId: z.number().int().positive().openapi({
    description: 'Unique patient ID of the family creator AKA principal',
    example: 1,
  }),
  relativeId: z.number().int().positive().openapi({
    description: 'Unique patient ID of the family member AKA relative',
    example: 1,
  }),
  relationshipId: z.number().int().positive().openapi({
    description: 'Unique relationship ID of the family member',
    example: 1,
  }),
  isVerified: z.boolean().openapi({
    description: 'Is the family member verified to access all the data',
    example: true,
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

export type FamilyDM = z.infer<typeof FamilyDMSchema>;
