import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { SpecialtyDTOSchema } from 'src/app/entities/dtos/service/specialty.dto';
extendZodWithOpenApi(z);

export const DoctorDTOSchema = z.object({
  id: z.string().optional().openapi({
    description: 'Unique ID of the doctor',
    example: '70358611',
  }),
  name: z.string().optional().openapi({
    description: 'Name of the doctor',
    example: 'MARÍA DEL CARMEN PA JA',
  }),
  specialty: SpecialtyDTOSchema.optional(),
});

export type DoctorDTO = z.infer<typeof DoctorDTOSchema>;
