import { z } from 'zod';

import { InsuranceDueDTOSchema } from './insuranceDue.dto';

export const InsuranceDueSectionDTOSchema = z.object({
  title: z.string().optional(),
  dues: z.array(InsuranceDueDTOSchema),
});

export type InsuranceDueSectionDTO = z.infer<typeof InsuranceDueSectionDTOSchema>;
