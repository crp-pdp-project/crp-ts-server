import { z, ZodSchema } from 'zod';

import { BadRequestResponseDTOSchema } from 'src/app/entities/dtos/response/badRequest.response.dto';
import { UnauthorizedResponseDTOSchema } from 'src/app/entities/dtos/response/unauthorized.response.dto';
import { ForbiddenResponseDTOSchema } from 'src/app/entities/dtos/response/forbidden.response.dto';
import { NotFoundResponseDTOSchema } from 'src/app/entities/dtos/response/notFound.response.dto';
import { ConflictResponseDTOSchema } from 'src/app/entities/dtos/response/conflict.response.dto';
import { UnprocessableEntityResponseDTOSchema } from 'src/app/entities/dtos/response/unprocessableEntity.response.dto';
import { LockedResponseDTOSchema } from 'src/app/entities/dtos/response/locked.response.dto';
import { InternalServerErrorResponseDTOSchema } from 'src/app/entities/dtos/response/internalServerError.response.dto';
import { IResponseStrategy } from 'src/app/interactors/response/response.interactor';

export class ErrorResponseStrategy implements IResponseStrategy {
  getSchema(): ZodSchema {
   return z.discriminatedUnion('statusCode', [
      BadRequestResponseDTOSchema,
      UnauthorizedResponseDTOSchema,
      ForbiddenResponseDTOSchema,
      NotFoundResponseDTOSchema,
      ConflictResponseDTOSchema,
      UnprocessableEntityResponseDTOSchema,
      LockedResponseDTOSchema,
      InternalServerErrorResponseDTOSchema,
    ]);
  }
}
