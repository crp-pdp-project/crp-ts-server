import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { AppointmentStates } from 'src/general/enums/appointmentState.enum';

extendZodWithOpenApi(z);

export const PatientCurrentAppointmentsOutputDTOSchema = z
  .object({
    appointments: z.array(
      z.object({
        id: z.string().openapi({
          description: 'Unique ID of the appointment',
          example: 'C202335563796',
        }),
        episodeId: z.string().openapi({
          description: 'Unique episode ID of the appointment',
          example: 'C23CLIRP35563796',
        }),
        date: z.string().openapi({
          description: 'Appointment schedule date in DD-MM-YYYY HH:mm:ss',
          example: '01-01-2025 00:00:00',
        }),
        status: z.enum(AppointmentStates).optional().openapi({
          description: 'Appointment status, either 1 2 or 3. By default 1 is sent',
          example: AppointmentStates.PROGRAMMED,
        }),
        doctor: z
          .object({
            id: z.string().openapi({
              description: 'Unique ID of the doctor',
              example: '70358611',
            }),
            name: z.string().openapi({
              description: 'Name of the doctor',
              example: 'MARÍA DEL CARMEN PA JA',
            }),
          })
          .openapi({
            description: 'Doctor model',
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
        insurance: z
          .object({
            id: z.string().openapi({
              description: 'Unique ID of the insurance',
              example: '16260',
            }),
            inspectionId: z.string().openapi({
              description: 'Unique Inspection ID of the insurance',
              example: '99',
            }),
          })
          .openapi({
            description: 'insurance model',
          }),
        appointmentType: z
          .object({
            id: z.string().openapi({
              description: 'Unique ID of the appointment type',
              example: '3300-10010942',
            }),
            name: z.string().openapi({
              description: 'Name of the appointment type',
              example: 'CONSULTA NO PRESENCIAL',
            }),
          })
          .openapi({
            description: 'Appointment type model',
          }),
      }),
    ),
  })
  .strict()
  .openapi({
    description: 'Patient Appointment Response Body',
  });

export type PatientCurrentAppointmentsOutputDTO = z.infer<typeof PatientCurrentAppointmentsOutputDTOSchema>;
