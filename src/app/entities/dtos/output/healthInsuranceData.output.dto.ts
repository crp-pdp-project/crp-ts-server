import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { HealthInsuranceDTOSchema } from '../service/healthInsurance.dto';

extendZodWithOpenApi(z);

export const HealthInsuranceDataOutputDTOSchema = HealthInsuranceDTOSchema.strip().openapi({
  description: 'Health Insurance Data Response Body',
});

export type HealthInsuranceDataOutputDTO = z.infer<typeof HealthInsuranceDataOutputDTOSchema>;
