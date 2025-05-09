import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { StatusCode, StatusMessage } from 'src/general/enums/status.enum';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const InternalServerErrorResponseDTOSchema = z.object({
  success: z.literal(false).openapi({
    description: 'Indicates the request failed.',
    example: false,
  }),
  statusCode: z.literal(StatusCode.INTERNAL_SERVER_ERROR).openapi({
    description: 'HTTP status code for the error.',
    example: StatusCode.INTERNAL_SERVER_ERROR,
  }),
  statusMessage: z.literal(StatusMessage.INTERNAL_SERVER_ERROR).openapi({
    description: 'Textual description of the status.',
    example: StatusMessage.INTERNAL_SERVER_ERROR,
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

export type InternalServerErrorResponseDTO = z.infer<typeof InternalServerErrorResponseDTOSchema>;
