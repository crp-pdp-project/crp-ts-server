import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { Devices } from '../../models/device/device.model';

extendZodWithOpenApi(z);

export const BaseHeadersDTOSchema = z.preprocess(
  (raw?: unknown) => {
    const headers = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    return {
      'X-Os': headers['x-os'],
      'X-Device-Id': headers['x-device-id'],
      'X-Device-Name': headers['x-device-name'],
      'X-Push-Token': headers['x-push-token'],
    };
  },
  z
    .object({
      'X-Os': z.enum(Devices).openapi({
        description: 'OS of the device',
        example: Devices.IOS,
      }),
      'X-Device-Id': z.string().openapi({
        description: 'Unique Identifier of the device',
        example: 'anyUUID',
      }),
      'X-Device-Name': z.string().openapi({
        description: 'Name of the device',
        example: 'anyName',
      }),
      'X-Push-Token': z.string().optional().openapi({
        description: 'Push token of the device only if new one is available',
        example: 'fcm:AAA... / apns:BBB...',
      }),
    })
    .openapi({
      description: 'Base request headers',
    }),
);

export type BaseHeadersDTO = z.infer<typeof BaseHeadersDTOSchema>;
export interface BaseHeadersInputDTO {
  Headers: BaseHeadersDTO;
}
