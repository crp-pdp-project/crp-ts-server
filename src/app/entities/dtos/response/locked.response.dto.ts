import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { StatusCode, StatusMessage } from 'src/general/enums/status.enum';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const LockedResponseDTOSchema = z.object({
  success: z.literal(false).openapi({
    description: 'Indicates the request failed.',
    example: false,
  }),
  statusCode: z.literal(StatusCode.LOCKED).openapi({
    description: 'HTTP status code for the error.',
    example: StatusCode.LOCKED,
  }),
  statusMessage: z.literal(StatusMessage.LOCKED).openapi({
    description: 'Textual description of the status.',
    example: StatusMessage.LOCKED,
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

export type LockedResponseDTO = z.infer<typeof LockedResponseDTOSchema>;
