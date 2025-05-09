import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { StatusCode, StatusMessage } from 'src/general/enums/status.enum';
extendZodWithOpenApi(z);

export const UnauthorizedResponseDTOSchema = z.object({
  success: z.literal(false).openapi({
    description: 'Indicates the request failed.',
    example: false,
  }),
  statusCode: z.literal(StatusCode.UNAUTHORIZED).openapi({
    description: 'HTTP status code for the error.',
    example: StatusCode.UNAUTHORIZED,
  }),
  statusMessage: z.literal(StatusMessage.UNAUTHORIZED).openapi({
    description: 'Textual description of the status.',
    example: StatusMessage.UNAUTHORIZED,
  }),
  message: z.string().openapi({
    description: 'Raw internal error message intended for the developer.',
    example: 'Generic error',
  }),
  detail: z.string().openapi({
    description: 'Detailed explanation of the error intentend for the consumer.',
    example: 'User with ID 123 does not exist.',
  }),
});

export type UnauthorizedResponseDTO = z.infer<typeof UnauthorizedResponseDTOSchema>;
