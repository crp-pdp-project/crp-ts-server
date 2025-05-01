import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const InsuranceDTOSchema = z.object({
  id: z.string().optional().openapi({
    description: 'Unique ID of the insurance',
    example: '16260',
  }),
  inspectionId: z.string().optional().openapi({
    description: 'Unique Inspection ID of the insurance',
    example: '99',
  }),
  name: z.string().optional().openapi({
    description: 'Name of the insurance',
    example: '24DR',
  }),
});

export type InsuranceDTO = z.infer<typeof InsuranceDTOSchema>;
