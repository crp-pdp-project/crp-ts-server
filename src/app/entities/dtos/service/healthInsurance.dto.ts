import { z } from 'zod';

import { HealthInsurancesDMSchema } from 'src/app/entities/dms/healthInsurances.dm';

export const HealthInsuranceDTOSchema = HealthInsurancesDMSchema.partial();

export type HealthInsuranceDTO = z.infer<typeof HealthInsuranceDTOSchema>;
