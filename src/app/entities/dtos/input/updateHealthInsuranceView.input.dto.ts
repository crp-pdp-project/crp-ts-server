import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { HealthInsurancesDMSchema } from '../../dms/healthInsurances.dm';

extendZodWithOpenApi(z);

export const UpdateHealthInsuranceBodyDTOSchema = HealthInsurancesDMSchema.pick({
  title: true,
  paragraph: true,
  subtitle: true,
  bullets: true,
  banner: true,
  pdfUrl: true,
})
  .strict()
  .openapi({
    description: 'Update health Insurance view request body',
  });

export type UpdateHealthInsuranceBodyDTO = z.infer<typeof UpdateHealthInsuranceBodyDTOSchema>;
export interface UpdateHealthInsuranceInputDTO {
  Body: UpdateHealthInsuranceBodyDTO;
}
