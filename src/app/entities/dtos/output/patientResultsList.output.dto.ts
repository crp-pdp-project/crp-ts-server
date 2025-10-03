import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientResultTypes } from 'src/general/enums/patientResultType.enum';

extendZodWithOpenApi(z);

export const PatientResultsListOutputDTOSchema = z
  .object({
    results: z
      .array(
        z.object({
          resultId: z.string().openapi({
            description: 'Unique ID of the result',
            example: 'C24CLIRP377628032025031308200010041633|40504165',
          }),
          episodeId: z.string().openapi({
            description: 'Unique episode ID of the result',
            example: 'C23CLIRP35563796',
          }),
          date: z.string().openapi({
            description: 'Result date in DD-MM-YYYY HH:mm:ss',
            example: '01-01-2025 00:00:00',
          }),
          doctor: z
            .object({
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
              name: z.string().openapi({
                description: 'Name of the specialty',
                example: 'Cardiologia',
              }),
            })
            .openapi({
              description: 'Specialty model',
            }),
          appointmentType: z
            .object({
              name: z.string().openapi({
                description: 'Name of the appointment type',
                example: 'CONSULTA NO PRESENCIAL',
              }),
            })
            .openapi({
              description: 'Appointment type model',
            }),
          type: z.enum(PatientResultTypes).openapi({
            description: 'Unique ID of the appointment',
            example: PatientResultTypes.LAB,
          }),
          accessNumber: z.string().openapi({
            description: 'Access number of the result',
            example: 'CLIRPC2437451050',
          }),
          gidenpac: z.string().openapi({
            description: 'Gidenpac code of the patient',
            example: '733480',
          }),
        }),
      )
      .openapi({
        description: 'Array of results',
      }),
  })
  .strict()
  .openapi({
    description: 'Patient Results Response Body',
  });

export type PatientResultsListOutputDTO = z.infer<typeof PatientResultsListOutputDTOSchema>;
