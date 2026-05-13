import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

import { DeviceDMSchema } from '../../dms/devices.dm';

extendZodWithOpenApi(z);

export const SendDeepLinkNotificationParamsDTOSchema = z
  .object({
    screen: z.string().openapi({
      description: 'Screen to redirect on push notification',
      example: 'appointment',
    }),
  })
  .strict()
  .openapi({
    description: 'Create appointment path params',
  });

export const SendDeepLinkNotificationBodyDTOSchema = PatientDMSchema.pick({
  documentType: true,
  documentNumber: true,
})
  .extend({
    device: DeviceDMSchema.shape.os,
    title: z.string().openapi({
      description: 'Title of the push notification',
      example: 'Titulo',
    }),
    body: z.string().openapi({
      description: 'Body of the push notification',
      example: 'Mensaje del push',
    }),
    params: z.record(z.string(), z.unknown()).openapi({
      description: 'Extra params for deeplink notification in object form',
      example: { appointmentId: 'test' },
    }),
  })
  .strict()
  .openapi({
    description: 'Send Notification Request Body',
  });

export type SendDeepLinkNotificationBodyDTO = z.infer<typeof SendDeepLinkNotificationBodyDTOSchema>;
export type SendDeepLinkNotificationParamsDTO = z.infer<typeof SendDeepLinkNotificationParamsDTOSchema>;
export interface SendDeepLinkNotificationInputDTO {
  Params: SendDeepLinkNotificationParamsDTO;
  Body: SendDeepLinkNotificationBodyDTO;
}
