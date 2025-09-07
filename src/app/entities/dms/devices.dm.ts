import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { Devices } from '../models/device/device.model';

extendZodWithOpenApi(z);

export const DeviceDMSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Internal unique ID of the device',
    example: 1,
  }),
  patientId: z.number().int().positive().openapi({
    description: 'Unique ID of the patient',
    example: 1,
  }),
  os: z.enum(Devices).openapi({
    description: 'Device Identifier',
    example: Devices.IOS,
  }),
  identifier: z.uuid().openapi({
    description: 'Unique Identifier of the device',
    example: 'anyUUID',
  }),
  name: z.string().openapi({
    description: 'Name of the device',
    example: 'anyName',
  }),
  pushToken: z.string().nullable().openapi({
    description: 'Push token of the registered device',
    example: 'AnyToken',
  }),
  biometricHash: z.string().nullable().openapi({
    description: 'Hashed biometric UUID of the device',
    example: 'AnyHash',
  }),
  biometricSalt: z.string().nullable().openapi({
    description: 'Salt using for the hashing of the device biometric UUID',
    example: 'AnySalt',
  }),
  expiresAt: z.string().openapi({
    description: 'Expiration date of the device in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  createdAt: z.string().openapi({
    description: 'Creation date of the device in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  updatedAt: z.string().openapi({
    description: 'Last update of the device in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
});

export type DeviceDM = z.infer<typeof DeviceDMSchema>;
