import { z } from 'zod';

import { EmployeeSessionDMSchema } from '../../dms/employeeSessions.dm';

export const EmployeeSessionDTOSchema = EmployeeSessionDMSchema.partial();

export type EmployeeSessionDTO = z.infer<typeof EmployeeSessionDTOSchema>;
