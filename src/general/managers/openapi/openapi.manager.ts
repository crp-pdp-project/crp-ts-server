import { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import { ZodObject, ZodTransform, ZodPipe } from 'zod';

import { BadRequestResponseDTOSchema } from 'src/app/entities/dtos/response/badRequest.response.dto';
import { ConflictResponseDTOSchema } from 'src/app/entities/dtos/response/conflict.response.dto';
import { ForbiddenResponseDTOSchema } from 'src/app/entities/dtos/response/forbidden.response.dto';
import { InternalServerErrorResponseDTOSchema } from 'src/app/entities/dtos/response/internalServerError.response.dto';
import { LockedResponseDTOSchema } from 'src/app/entities/dtos/response/locked.response.dto';
import { NotFoundResponseDTOSchema } from 'src/app/entities/dtos/response/notFound.response.dto';
import { UnauthorizedResponseDTOSchema } from 'src/app/entities/dtos/response/unauthorized.response.dto';
import { UnprocessableEntityResponseDTOSchema } from 'src/app/entities/dtos/response/unprocessableEntity.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { PreconditionRequiredResponseDTOSchema } from 'src/app/entities/dtos/response/preconditionRequired.response.dto';
import { GatewayTimeoutResponseDTOSchema } from 'src/app/entities/dtos/response/gatewayTimeout.response.dto';

type LooseZodObject = ZodObject | ZodPipe<ZodTransform>;

type RequestData = {
  query?: LooseZodObject;
  params?: LooseZodObject;
  headers?: LooseZodObject;
  body?: LooseZodObject;
};

type RouteDocParams = RequestData & {
  method: HttpSpecMethod;
  path: string;
  description: string;
  tags: string[];
  responses: Record<number, LooseZodObject>;
  secure?: boolean;
};

type RouteSchemaParams = RequestData & {
  name: string;
  schema: LooseZodObject;
};

export interface IOpenApiManager {
  registerRoute(payload: RouteDocParams): void;
  registerSchema(payload: RouteSchemaParams): void;
}

export class OpenApiManager implements IOpenApiManager {
  private readonly defaultErrorResponses: Record<number, LooseZodObject> = {
    [StatusCode.BAD_REQUEST]: BadRequestResponseDTOSchema,
    [StatusCode.UNAUTHORIZED]: UnauthorizedResponseDTOSchema,
    [StatusCode.FORBIDDEN]: ForbiddenResponseDTOSchema,
    [StatusCode.NOT_FOUND]: NotFoundResponseDTOSchema,
    [StatusCode.CONFLICT]: ConflictResponseDTOSchema,
    [StatusCode.UNPROCESSABLE_ENTITY]: UnprocessableEntityResponseDTOSchema,
    [StatusCode.LOCKED]: LockedResponseDTOSchema,
    [StatusCode.PRECONDITION_REQUIRED]: PreconditionRequiredResponseDTOSchema,
    [StatusCode.INTERNAL_SERVER_ERROR]: InternalServerErrorResponseDTOSchema,
    [StatusCode.GATEWAY_TIMEOUT]: GatewayTimeoutResponseDTOSchema,
  };

  constructor(private readonly registry: OpenAPIRegistry) {
    this.buildSecurityScheme();
  }

  registerSchema(payload: RouteSchemaParams): void {
    const { name, schema } = payload;

    this.registry.register(name, schema);
  }

  registerRoute(payload: RouteDocParams): void {
    const { method, path, description, tags, query, params, headers, body, responses, secure } = payload;

    this.registry.registerPath({
      method,
      path,
      description,
      summary: description,
      tags,
      request: this.buildRequest(description, { query, params, headers, body }),
      responses: this.buildResponses(description, responses),
      security: secure ? [{ bearerAuth: [] }] : undefined,
    });
  }

  private buildRequest(description: string, { query, params, headers, body }: RequestData): RouteConfig['request'] {
    const request: RouteConfig['request'] = {};

    if (query) request.query = query;
    if (params) request.params = params;
    if (headers) request.headers = headers;

    if (body) {
      request.body = {
        description: `${description} request body`,
        content: {
          'application/json': { schema: body },
        },
      };
    }

    return request;
  }

  private buildResponses(
    description: string,
    successResponses: Record<number, LooseZodObject>,
  ): RouteConfig['responses'] {
    const allResponses: Record<number, LooseZodObject> = {
      ...successResponses,
      ...this.defaultErrorResponses,
    };

    const formatted: RouteConfig['responses'] = {};

    for (const [status, schema] of Object.entries(allResponses)) {
      formatted[Number(status)] = {
        description: Number(status) >= 400 ? 'Error response' : `${description} response`,
        content: {
          'application/json': { schema },
        },
      };
    }

    return formatted;
  }

  private buildSecurityScheme(): void {
    this.registry.registerComponent('securitySchemes', 'bearerAuth', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    });
  }
}
