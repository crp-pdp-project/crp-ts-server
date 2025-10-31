import { z, ZodDiscriminatedUnion, ZodObject, ZodRawShape } from 'zod';

import { BadRequestResponseDTOSchema } from 'src/app/entities/dtos/response/badRequest.response.dto';
import { ConflictResponseDTOSchema } from 'src/app/entities/dtos/response/conflict.response.dto';
import { ForbiddenResponseDTOSchema } from 'src/app/entities/dtos/response/forbidden.response.dto';
import { InternalServerErrorResponseDTOSchema } from 'src/app/entities/dtos/response/internalServerError.response.dto';
import { LockedResponseDTOSchema } from 'src/app/entities/dtos/response/locked.response.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { NotFoundResponseDTOSchema } from 'src/app/entities/dtos/response/notFound.response.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { PreconditionRequiredResponseDTOSchema } from 'src/app/entities/dtos/response/preconditionRequired.response.dto';
import { UnauthorizedResponseDTOSchema } from 'src/app/entities/dtos/response/unauthorized.response.dto';
import { UnprocessableEntityResponseDTOSchema } from 'src/app/entities/dtos/response/unprocessableEntity.response.dto';

import { IResponseStrategy } from '../response.manager';
import { GatewayTimeoutResponseDTOSchema } from 'src/app/entities/dtos/response/gatewayTimeout.response.dto';

export class MixedResponseStrategy implements IResponseStrategy {
  constructor(private readonly dataSchema: ZodObject<ZodRawShape>) {}

  getSchema(): ZodDiscriminatedUnion {
    return z.discriminatedUnion('statusCode', [
      OkResponseDTOSchema.extend({ data: this.dataSchema.strip() }).strip(),
      NoContentResponseDTOSchema,
      BadRequestResponseDTOSchema,
      UnauthorizedResponseDTOSchema,
      ForbiddenResponseDTOSchema,
      NotFoundResponseDTOSchema,
      ConflictResponseDTOSchema,
      UnprocessableEntityResponseDTOSchema,
      LockedResponseDTOSchema,
      PreconditionRequiredResponseDTOSchema,
      InternalServerErrorResponseDTOSchema,
      GatewayTimeoutResponseDTOSchema
    ]);
  }
}
