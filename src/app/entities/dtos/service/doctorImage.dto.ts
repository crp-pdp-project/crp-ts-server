import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const DoctorDTOSchema = z.object({
  id: z.string().optional().openapi({
    description: 'Unique ID of the doctor',
    example: '70358611',
  }),
  profileImage: z.string().optional().openapi({
    description: 'Profile image of the doctor',
    example: 'https://...',
  }),
});

export type DoctorDTO = z.infer<typeof DoctorDTOSchema>;
