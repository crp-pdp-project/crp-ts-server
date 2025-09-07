import { z } from 'zod';

export const InsuranceDTOSchema = z.object({
  id: z.string().optional(),
  inspectionId: z.string().optional(),
  iafaId: z.string().optional(),
  fasId: z.string().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
});

export type InsuranceDTO = z.infer<typeof InsuranceDTOSchema>;
