import { z } from 'zod';

import { InsuranceDueDTOSchema } from './insuranceDue.dto';

export const InsuredPatientDuesDTOSchema = z.object({
  versionNumber: z.number().optional(),
  dueList: z.array(InsuranceDueDTOSchema).optional(),
});

export type InsuredPatientDuesDTO = z.infer<typeof InsuredPatientDuesDTOSchema>;
