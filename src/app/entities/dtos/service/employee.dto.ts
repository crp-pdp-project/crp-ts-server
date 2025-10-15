import { z } from 'zod';

export const EmployeeDTOSchema = z.object({
  username: z.string(),
  internalUsername: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
});

export type EmployeeDTO = z.infer<typeof EmployeeDTOSchema>;
