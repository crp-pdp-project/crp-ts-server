import { z } from 'zod';

import { EmployeeDTOSchema } from './employee.dto';

export const EmployeeSessionPayloadDTOSchema = z
  .object({
    employee: EmployeeDTOSchema.required(),
  })
  .strict();

export type EmployeeSessionPayloadDTO = z.infer<typeof EmployeeSessionPayloadDTOSchema>;
