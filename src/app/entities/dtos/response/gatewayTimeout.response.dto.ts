import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { StatusCode, StatusMessage } from 'src/general/enums/status.enum';
extendZodWithOpenApi(z);

export const GatewayTimeoutResponseDTOSchema = z
  .object({
    success: z.literal(false).openapi({
      description: 'Indicates the request failed.',
      example: false,
    }),
    statusCode: z.literal(StatusCode.GATEWAY_TIMEOUT).openapi({
      description: 'HTTP status code for the error.',
      example: StatusCode.GATEWAY_TIMEOUT,
    }),
    statusMessage: z.literal(StatusMessage.GATEWAY_TIMEOUT).openapi({
      description: 'Textual description of the status.',
      example: StatusMessage.GATEWAY_TIMEOUT,
    }),
    message: z.string().openapi({
      description: 'Raw internal error message intended for the developer.',
      example: 'Generic error',
    }),
    detail: z.string().openapi({
      description: 'Detailed explanation of the error intentend for the consumer.',
      example: 'User with ID 123 does not exist.',
    }),
  })
  .strict();

export type GatewayTimeoutResponseDTO = z.infer<typeof GatewayTimeoutResponseDTOSchema>;
