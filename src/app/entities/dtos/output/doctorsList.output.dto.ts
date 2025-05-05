import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const DoctorsListOutputDTOSchema = z
  .array(
    z.object({
      id: z.string().openapi({
        description: 'Unique ID of the doctor',
        example: '70358611',
      }),
      name: z.string().openapi({
        description: 'Name of the doctor',
        example: 'Maria Del Carmen Pa Ja',
      }),
      profileImage: z.string().nullable().openapi({
        description: 'Profile image of the doctor',
        example: 'https://...',
      }),
      specialty: z
        .object({
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
        })
        .openapi({
          description: 'Specialty model',
        }),
    }),
  )
  .openapi({
    description: 'Doctors List Response Body',
  });

export type DoctorsListOutputDTO = z.infer<typeof DoctorsListOutputDTOSchema>;
