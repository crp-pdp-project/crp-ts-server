import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const SpecialtiesListOutputDTOSchema = z
  .object({
    specialties: z.array(
      z.object({
        id: z.string().openapi({
          description: 'Unique ID of the specialty',
          example: '2600',
        }),
        groupId: z.string().openapi({
          description: 'Unique group ID of the specialty',
          example: '26',
        }),
        name: z.string().openapi({
          description: 'Name of the specialty',
          example: 'Cardiologia',
        }),
      }),
    ),
  })
  .strip()
  .openapi({
    description: 'Specialties List Response Body',
  });

export type SpecialtiesListOutputDTO = z.infer<typeof SpecialtiesListOutputDTOSchema>;
