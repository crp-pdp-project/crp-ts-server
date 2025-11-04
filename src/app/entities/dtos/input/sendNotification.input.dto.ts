import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

import { DeviceDMSchema } from '../../dms/devices.dm';

extendZodWithOpenApi(z);

export const SendNotificationBodyDTOSchema = PatientDMSchema.pick({
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
    url: z.url().optional().openapi({
      description: 'External url to redirect on push click',
      example: 'https://google.com/',
    }),
  })
  .strict()
  .openapi({
    description: 'Send Notification Request Body',
  });

export type SendNotificationBodyDTO = z.infer<typeof SendNotificationBodyDTOSchema>;
export interface SendNotificationInputDTO {
  Body: SendNotificationBodyDTO;
}
