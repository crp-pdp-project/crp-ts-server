import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  AppointmentStates,
  CancelActionStates,
  PaymentActionStates,
  PayStates,
  RescheduleActionStates,
} from 'src/general/enums/appointmentState.enum';
import { InsuranceTypes } from 'src/general/enums/insuranceType.enum';

extendZodWithOpenApi(z);

export const PatientAppointmentOutputDTOSchema = z
  .object({
    id: z.string().openapi({
      description: 'Unique ID of the appointment',
      example: 'C202335563796',
    }),
    episodeId: z.string().optional().openapi({
      description: 'Unique episode ID of the appointment',
      example: 'C23CLIRP35563796',
    }),
    date: z.string().optional().openapi({
      description: 'Appointment schedule date in DD-MM-YYYY HH:mm:ss',
      example: '01-01-2025 00:00:00',
    }),
    mode: z.string().optional().openapi({
      description: 'Appointment mode',
      example: 'Presencial',
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
      .optional()
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
      .optional()
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
        iafaId: z.string().openapi({
          description: 'Unique Iafa ID of the insurance',
          example: '99000',
        }),
        fasId: z.string().openapi({
          description: 'Unique fas ID of the insurance',
          example: '9900',
        }),
        name: z.string().openapi({
          description: 'Name of the insurance',
          example: 'Cardiologia',
        }),
        type: z.enum(InsuranceTypes).openapi({
          description: 'Type of the insurance',
          example: InsuranceTypes.SITEDS,
        }),
      })
      .optional()
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
      .optional()
      .openapi({
        description: 'Appointment type model',
      }),
    cancelAction: z.enum(CancelActionStates).optional().openapi({
      description: 'State of the cancelation action',
      example: CancelActionStates.ALLOWED,
    }),
    rescheduleAction: z.enum(RescheduleActionStates).optional().openapi({
      description: 'State of the reschedule action',
      example: RescheduleActionStates.ALLOWED,
    }),
    payAction: z.enum(PaymentActionStates).optional().openapi({
      description: 'State of the reschedule action',
      example: PaymentActionStates.ALLOWED,
    }),
    payState: z.enum(PayStates).optional().openapi({
      description: 'State of the reschedule action',
      example: PayStates.PAYED,
    }),
    tips: z
      .array(
        z.object({
          title: z.string().openapi({
            description: 'Title of the tip',
            example: 'Any Title',
          }),
          content: z.array(z.string()).openapi({
            description: 'Content of the tip',
            example: ['Any Content'],
          }),
        }),
      )
      .openapi({
        description: 'Array of tips',
      }),
  })
  .strip()
  .openapi({
    description: 'Patient Appointment Response Body',
  });

export type PatientAppointmentOutputDTO = z.infer<typeof PatientAppointmentOutputDTOSchema>;
