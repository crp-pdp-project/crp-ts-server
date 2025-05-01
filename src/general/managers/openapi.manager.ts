import { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import { ZodObject, ZodRawShape, ZodSchema } from 'zod';

import { ErrorResponseDTOSchema } from 'src/app/entities/dtos/service/errorResponse.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';

type ZodSchemaObject = ZodObject<ZodRawShape>;

type RouteDocParams = {
  method: HttpSpecMethod;
  path: string;
  description: string;
  tags: string[];
  query?: ZodSchemaObject;
  params?: ZodSchemaObject;
  body?: ZodSchemaObject;
  responses: Record<number, ZodSchema>;
  secure?: boolean;
};

type RequestData = {
  query?: ZodSchemaObject;
  params?: ZodSchemaObject;
  body?: ZodSchemaObject;
};

export interface IOpenApiManager {
  registerRoute(payload: RouteDocParams): void;
  registerSchema(name: string, schema: ZodSchemaObject): void;
}

export class OpenApiManager implements IOpenApiManager {
  private readonly defaultErrorResponses: Record<number, ZodSchema> = {
    400: ErrorResponseDTOSchema,
    401: ErrorResponseDTOSchema,
    403: ErrorResponseDTOSchema,
    404: ErrorResponseDTOSchema,
    409: ErrorResponseDTOSchema,
    422: ErrorResponseDTOSchema,
    500: ErrorResponseDTOSchema,
  };

  constructor(private readonly registry: OpenAPIRegistry) {
    this.buildSecurityScheme();
  }

  registerSchema(name: string, schema: ZodSchemaObject): void {
    this.registry.register(name, schema);
  }

  registerRoute(payload: RouteDocParams): void {
    const { method, path, description, tags, query, params, body, responses, secure } = payload;
    this.registry.registerPath({
      method,
      path,
      description,
      tags,
      request: this.buildRequest(description, { query, params, body }),
      responses: this.buildResponses(description, responses),
      security: secure ? [{ bearerAuth: [] }] : undefined,
    });
  }

  private buildRequest(description: string, { query, params, body }: RequestData): RouteConfig['request'] {
    const request: RouteConfig['request'] = {};

    if (query) request.query = query;
    if (params) request.params = params;

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

  private buildResponses(description: string, successResponses: Record<number, ZodSchema>): RouteConfig['responses'] {
    const allResponses: Record<number, ZodSchema> = {
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
