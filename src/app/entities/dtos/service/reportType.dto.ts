import { z } from 'zod';

export const ReportTypeDTOSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().optional(),
  group: z.string().optional(),
});

export type ReportTypeDTO = z.infer<typeof ReportTypeDTOSchema>;
