import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  AppointmentDocumentIcon,
  AppointmentDocumentTitle,
} from 'src/general/enums/appointmentDocumentCategories.enum';
import {
  AppointmentStates,
  CancelActionStates,
  PaymentActionStates,
  PayStates,
  RescheduleActionStates,
} from 'src/general/enums/appointmentState.enum';
import { InsuranceTypes } from 'src/general/enums/insuranceType.enum';
import { SitedsDocumentType } from 'src/general/enums/patientInfo.enum';

extendZodWithOpenApi(z);

export const PatientAppointmentDetailOutputDTOSchema = z
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
        ipressId: z.string().openapi({
          description: 'Unique ipress ID of the clinic',
          example: '00009409',
        }),
        iafaId: z.string().openapi({
          description: 'Unique ipress ID of the insurance',
          example: '20004',
        }),
        date: z.string().openapi({
          description: 'Transaction date in DD-MM-YYYY',
          example: '01-01-2025',
        }),
        time: z.string().openapi({
          description: 'Transaction time HH:mm:ss',
          example: '00:00:00',
        }),
        details: z
          .array(
            z.object({
              patientEntityType: z.string().openapi({
                description: 'Entity type of the patient',
                example: 'PERSONA NATURAL',
              }),
              patientLastName: z.string().openapi({
                description: 'Last name of the patient',
                example: 'VARGAS',
              }),
              patientFirstName: z.string().openapi({
                description: 'First name of the patient',
                example: 'JOSE LUIS',
              }),
              patientMemberId: z.string().openapi({
                description: 'Unique member ID of the patient',
                example: '0006102542',
              }),
              patientSecondLastName: z.string().openapi({
                description: 'Second last name of the patient',
                example: 'ARANA',
              }),
              patientDocumentType: z.enum(SitedsDocumentType).openapi({
                description: 'Document type of the patient',
                example: SitedsDocumentType.DNI,
              }),
              patientDocumentNumber: z.string().openapi({
                description: 'Document number of the patient',
                example: '72905847',
              }),
              productCode: z.string().openapi({
                description: 'Code of the product for the selected iafa',
                example: 'R',
              }),
              productDescription: z.string().openapi({
                description: 'Description of the product',
                example: 'SEGURO COMPLEM. TRABAJO DE RIESGO',
              }),
              contractorEntityType: z.string().openapi({
                description: 'Entity type of the contractor',
                example: 'PERSONA JURIDICA',
              }),
              contractorFirstName: z.string().openapi({
                description: 'Name of the contractor',
                example: 'WORLD LOGISTIC S.A.C. WORLD LOGISTI',
              }),
              contractorDocumentType: z.string().openapi({
                description: 'Document type of the contractor',
                example: 'RUC',
              }),
              contractorIdQualifier: z.string().openapi({
                description: 'Unique qualifier ID of the contractor',
                example: 'XX5',
              }),
              contractorId: z.string().openapi({
                description: 'Unique ID of the contractor',
                example: '20513408090',
              }),
              coverages: z
                .array(
                  z.object({
                    coverageTypeCode: z.string().openapi({
                      description: 'Type of the coverage',
                      example: 'AMBULATORIO',
                    }),
                    coverageSubtypeCode: z.string().openapi({
                      description: 'Subtype of the coverage',
                      example: '100',
                    }),
                    currencyCode: z.string().openapi({
                      description: 'Currency of the coverage',
                      example: 'SOLES',
                    }),
                    copayFixed: z.number().openapi({
                      description: 'Fixed amount to pay for the coverage',
                      example: 0,
                    }),
                    serviceCalcCode: z.string().openapi({
                      description: 'Service code of the coverage',
                      example: 'ZU',
                    }),
                    serviceCalcQuantity: z.number().openapi({
                      description: 'Service quantity of the coverage',
                      example: 0,
                    }),
                    copayVariable: z.number().openapi({
                      description: 'Covered percentage amount of the coverage',
                      example: 100,
                    }),
                    taxAmount: z.number().openapi({
                      description: 'Amount to be pay in taxes for the coverage',
                      example: 0,
                    }),
                    preTaxAmount: z.number().openapi({
                      description: 'Net amount the coverage',
                      example: 0,
                    }),
                  }),
                )
                .openapi({
                  description: 'Array of siteds coverages',
                }),
            }),
          )
          .openapi({
            description: 'Array of siteds patient details',
          }),
      })
      .optional()
      .openapi({
        description: 'Siteds result',
      }),
  })
  .strict()
  .openapi({
    description: 'Patient Appointment Response Body',
  });

export type PatientAppointmentDetailOutputDTO = z.infer<typeof PatientAppointmentDetailOutputDTOSchema>;
