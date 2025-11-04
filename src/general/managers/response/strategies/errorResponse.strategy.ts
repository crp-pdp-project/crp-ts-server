import { z, ZodDiscriminatedUnion } from 'zod';

import { BadRequestResponseDTOSchema } from 'src/app/entities/dtos/response/badRequest.response.dto';
import { ConflictResponseDTOSchema } from 'src/app/entities/dtos/response/conflict.response.dto';
import { ForbiddenResponseDTOSchema } from 'src/app/entities/dtos/response/forbidden.response.dto';
import { GatewayTimeoutResponseDTOSchema } from 'src/app/entities/dtos/response/gatewayTimeout.response.dto';
import { InternalServerErrorResponseDTOSchema } from 'src/app/entities/dtos/response/internalServerError.response.dto';
import { LockedResponseDTOSchema } from 'src/app/entities/dtos/response/locked.response.dto';
import { NotFoundResponseDTOSchema } from 'src/app/entities/dtos/response/notFound.response.dto';
import { PreconditionRequiredResponseDTOSchema } from 'src/app/entities/dtos/response/preconditionRequired.response.dto';
import { UnauthorizedResponseDTOSchema } from 'src/app/entities/dtos/response/unauthorized.response.dto';
import { UnprocessableEntityResponseDTOSchema } from 'src/app/entities/dtos/response/unprocessableEntity.response.dto';

import { IResponseStrategy } from '../response.manager';

export class ErrorResponseStrategy implements IResponseStrategy {
  getSchema(): ZodDiscriminatedUnion {
    return z.discriminatedUnion('statusCode', [
      BadRequestResponseDTOSchema,
      UnauthorizedResponseDTOSchema,
      ForbiddenResponseDTOSchema,
      NotFoundResponseDTOSchema,
      ConflictResponseDTOSchema,
      UnprocessableEntityResponseDTOSchema,
      LockedResponseDTOSchema,
      PreconditionRequiredResponseDTOSchema,
      InternalServerErrorResponseDTOSchema,
      GatewayTimeoutResponseDTOSchema,
    ]);
  }
}
