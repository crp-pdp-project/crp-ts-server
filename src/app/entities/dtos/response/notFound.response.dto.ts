import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { StatusCode, StatusMessage } from 'src/general/enums/status.enum';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const NotFoundResponseDTOSchema = z.object({
  success: z.literal(false).openapi({
    description: 'Indicates the request failed.',
    example: false,
  }),
  statusCode: z.literal(StatusCode.NOT_FOUND).openapi({
    description: 'HTTP status code for the error.',
    example: StatusCode.NOT_FOUND,
  }),
  statusMessage: z.literal(StatusMessage.NOT_FOUND).openapi({
    description: 'Textual description of the status.',
    example: StatusMessage.NOT_FOUND,
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

export type NotFoundResponseDTO = z.infer<typeof NotFoundResponseDTOSchema>;
