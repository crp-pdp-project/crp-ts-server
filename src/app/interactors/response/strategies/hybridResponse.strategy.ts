import { z, ZodSchema, ZodType } from 'zod';

import { BadRequestResponseDTOSchema } from 'src/app/entities/dtos/response/badRequest.response.dto';
import { UnauthorizedResponseDTOSchema } from 'src/app/entities/dtos/response/unauthorized.response.dto';
import { ForbiddenResponseDTOSchema } from 'src/app/entities/dtos/response/forbidden.response.dto';
import { NotFoundResponseDTOSchema } from 'src/app/entities/dtos/response/notFound.response.dto';
import { ConflictResponseDTOSchema } from 'src/app/entities/dtos/response/conflict.response.dto';
import { UnprocessableEntityResponseDTOSchema } from 'src/app/entities/dtos/response/unprocessableEntity.response.dto';
import { LockedResponseDTOSchema } from 'src/app/entities/dtos/response/locked.response.dto';
import { InternalServerErrorResponseDTOSchema } from 'src/app/entities/dtos/response/internalServerError.response.dto';
import { IResponseStrategy } from 'src/app/interactors/response/response.interactor';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';

export class HybridResponseStrategy<T> implements IResponseStrategy {
  constructor(private readonly dataSchema: ZodType<T>) {}

  getSchema(): ZodSchema {
    return z.discriminatedUnion('statusCode', [
      OkResponseDTOSchema.extend({ data: this.dataSchema }),
      NoContentResponseDTOSchema,
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
