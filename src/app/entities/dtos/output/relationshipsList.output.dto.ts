import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { RelationshipDMSchema } from '../../dms/relationships.dm';

extendZodWithOpenApi(z);
export const RelationshipsListOutputDTOSchema = z
  .object({
    relationships: z.array(
      RelationshipDMSchema.pick({
        id: true,
        name: true,
        isDependant: true,
      }),
    ),
  })
  .strict()
  .openapi({
    description: 'Relationships List Response Body',
  });

export type RelationshipsListOutputDTO = z.infer<typeof RelationshipsListOutputDTOSchema>;
