import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientReportGroup, PatientReportTypes } from 'src/general/enums/patientReportType.enum';

extendZodWithOpenApi(z);

export const PatientReportsListOutputDTOSchema = z
  .object({
    results: z
      .array(
        z.object({
          resultId: z.string().optional().openapi({
            description: 'Unique ID of the result, mandatory for group results',
            example: 'C24CLIRP377628032025031308200010041633|40504165',
          }),
          documentId: z.string().optional().openapi({
            description: 'Unique ID of the document, mandatory for group documents',
            example: '#b731d7bf-edea-cdce-1da3-08dd0351629c',
          }),
          episodeId: z.string().openapi({
            description: 'Unique episode ID of the result',
            example: 'C23CLIRP35563796',
          }),
          nhcId: z.string().optional().openapi({
            description: 'Unique NHC ID of the patient, mandatory for group results',
            example: '1',
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
          group: z.enum(PatientReportGroup).openapi({
            description: 'Group of the report',
            example: PatientReportGroup.RESULTS,
          }),
          type: z.enum(PatientReportTypes).openapi({
            description: 'Unique ID of the appointment',
            example: PatientReportTypes.LABORATORY,
          }),
          accessNumber: z.string().optional().openapi({
            description: 'Access number of the result, mandatory for group results',
            example: 'CLIRPC2437451050',
          }),
          gidenpac: z.string().optional().openapi({
            description: 'Gidenpac code of the patient, mandatory for group results',
            example: '733480',
          }),
        }),
      )
      .openapi({
        description: 'Array of results',
      }),
  })
  .strip()
  .openapi({
    description: 'Patient Results Response Body',
  });

export type PatientReportsListOutputDTO = z.infer<typeof PatientReportsListOutputDTOSchema>;
