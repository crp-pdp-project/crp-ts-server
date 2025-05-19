import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const AvailabilityListOutputDTOSchema = z
  .object({
    availability: z.array(
      z.object({
        date: z.string().openapi({
          description: 'Date of the available slot in DD-MM-YYYY',
          example: '01-01-2025',
        }),
        slots: z
          .array(
            z.object({
              time: z.string().openapi({
                description: 'Time of the available slot in DD-MM-YYYY HH:mm:ss',
                example: '01-01-2025 08:00:00',
              }),
              scheduleId: z.string().openapi({
                description: 'Schedule ID of the slot',
                example: 'CRP_CardFC',
              }),
              blockId: z.string().openapi({
                description: 'Block ID of the slot',
                example: 'Tar: __XJ__ (Mar-Dic25)',
              }),
            }),
          )
          .openapi({
            description: 'Slot array',
          }),
      }),
    ),
  })
  .strict()
  .openapi({
    description: 'Availability List Response Body',
  });

export type AvailabilityListOutputDTO = z.infer<typeof AvailabilityListOutputDTOSchema>;
