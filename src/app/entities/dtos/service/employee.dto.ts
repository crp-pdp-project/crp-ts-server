import { z } from 'zod';

export const EmployeeDTOSchema = z.object({
  username: z.string(),
  internalUsername: z.string().optional(),
  name: z.string().optional(),
});

export type EmployeeDTO = z.infer<typeof EmployeeDTOSchema>;
