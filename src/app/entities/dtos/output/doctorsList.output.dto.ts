import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const DoctorsListOutputDTOSchema = z
  .object({
    doctors: z.array(
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
          .optional()
          .openapi({
            description: 'Specialty model',
          }),
        availability: z
          .array(
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
          )
          .optional()
          .openapi({
            description: 'Availability array',
          }),
      }),
    ),
  })
  .strip()
  .openapi({
    description: 'Doctors List Response Body',
  });

export type DoctorsListOutputDTO = z.infer<typeof DoctorsListOutputDTOSchema>;
