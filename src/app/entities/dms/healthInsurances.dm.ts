import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const HealthInsurancesDMSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique ID of the health insurance',
    example: 1,
  }),
  title: z.string().openapi({
    description: 'Title of the health insurance',
    example: 'PlanSalud',
  }),
  paragraph: z.string().openapi({
    description: 'Description of the health insurance',
    example: 'Recibe la mejor cobertura...',
  }),
  subtitle: z.string().openapi({
    description: 'Sub title of the health insurance',
    example: 'Beneficios:',
  }),
  bullets: z.array(z.string()).openapi({
    description: 'Bullet array of the health insurance',
    example: ['Afiliación sin límite de edad'],
  }),
  banner: z.string().openapi({
    description: 'Banner url of the health insurance',
    example: 'https://...',
  }),
  pdfUrl: z.string().openapi({
    description: 'PDF document url of the health insurance',
    example: 'https://...',
  }),
  enabled: z.boolean().openapi({
    description: 'Is the health insurance enabled',
    example: true,
  }),
  createdAt: z.string().openapi({
    description: 'Creation date of the health insurance in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  updatedAt: z.string().openapi({
    description: 'Last update of the health insurance in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
});

export type HealthInsurancesDM = z.infer<typeof HealthInsurancesDMSchema>;
