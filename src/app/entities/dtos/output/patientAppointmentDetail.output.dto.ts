import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  AppointmentDocumentIcon,
  AppointmentDocumentTitle,
} from 'src/general/enums/appointmentDocumentCategories.enum';

import { PatientAppointmentOutputDTOSchema } from './patientAppointment.output.dto';

extendZodWithOpenApi(z);

export const PatientAppointmentDetailOutputDTOSchema = PatientAppointmentOutputDTOSchema.extend({
  documents: z
    .array(
      z.object({
        documentId: z.string().openapi({
          description: 'Unique ID of the document',
          example: '#b731d7bf-edea-cdce-1da3-08dd0351629c',
        }),
        title: z.enum(AppointmentDocumentTitle).optional().openapi({
          description: 'Title of the document category',
          example: AppointmentDocumentTitle.PRESCRIPTION,
        }),
        icon: z.enum(AppointmentDocumentIcon).optional().openapi({
          description: 'Icon of the document category',
          example: AppointmentDocumentIcon.PRESCRIPTION,
        }),
      }),
    )
    .optional(),
  siteds: z
    .object({
      base64: z.string().openapi({
        description: 'Encoded siteds response',
        example: 'anyBase64',
      }),
      amount: z.number().openapi({
        description: 'Amount to pay',
        example: 0,
      }),
    })
    .optional()
    .openapi({
      description: 'Siteds result',
    }),
})
  .strip()
  .openapi({
    description: 'Patient Appointment Detail Response Body',
  });

export type PatientAppointmentDetailOutputDTO = z.infer<typeof PatientAppointmentDetailOutputDTOSchema>;
