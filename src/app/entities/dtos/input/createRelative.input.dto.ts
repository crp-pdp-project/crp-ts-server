import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { FamilyDMSchema } from '../../dms/families.dm';

extendZodWithOpenApi(z);

export const CreateRelativeBodyDTOSchema = FamilyDMSchema.pick({
  relativeId: true,
  relationshipId: true,
})
  .strict()
  .openapi({
    description: 'Create relative request Body',
  });

export type CreateRelativeBodyDTO = z.infer<typeof CreateRelativeBodyDTOSchema>;
export interface CreateRelativeInputDTO {
  Body: CreateRelativeBodyDTO;
}
