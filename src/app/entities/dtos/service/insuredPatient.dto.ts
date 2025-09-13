import { z } from 'zod';

export const InsuredPatientDTOSchema = z.object({
  name: z.string().optional(),
  contractState: z.string().optional(),
});

export type InsuredPatientDTO = z.infer<typeof InsuredPatientDTOSchema>;
