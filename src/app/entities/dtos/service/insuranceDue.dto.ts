import { z } from 'zod';

export const InsuranceDueDTOSchema = z.object({
  id: z.string().optional(),
  dueDate: z.string().optional(),
  isOverdue: z.boolean().optional(),
  amount: z.number().optional(),
  lateFee: z.number().optional(),
  administrativeFee: z.number().optional(),
  minAmount: z.number().optional(),
  dueNumber: z.string().optional(),
  dueYear: z.string().optional(),
  version: z.number().optional(),
});

export type InsuranceDueDTO = z.infer<typeof InsuranceDueDTOSchema>;
