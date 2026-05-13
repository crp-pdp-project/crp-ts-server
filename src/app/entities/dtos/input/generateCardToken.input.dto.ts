import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const GenerateCardTokenBodyDTOSchema = z
  .object({
    transactionToken: z.string().openapi({
      description: 'Transaction token from POS',
      example: 'anyToken',
    }),
    customerEmail: z.string().optional().openapi({
      description: 'Email of the paying customer',
      example: 'any@mail.com',
    }),
    channel: z.string().optional().openapi({
      description: 'Channel response from POS',
      example: 'paycard',
    }),
  })
  .openapi({
    description: 'Generate Card Token Request Body',
  });

export const GenerateCardTokenQueryDTOSchema = z
  .object({
    token: z.string().openapi({
      description: 'Token of the POS',
      example: 'anyToken',
    }),
    redirect: z.url().openapi({
      description: 'Host URL to redirect',
      example: 'https://any.url.com/path',
    }),
  })
  .strict()
  .openapi({
    description: 'Generate Card Token Query params',
  });

export type GenerateCardTokenBodyDTO = z.infer<typeof GenerateCardTokenBodyDTOSchema>;
export type GenerateCardTokenQueryDTO = z.infer<typeof GenerateCardTokenQueryDTOSchema>;
export interface GenerateCardTokenInputDTO {
  Body: GenerateCardTokenBodyDTO;
  Querystring: GenerateCardTokenQueryDTO;
}
