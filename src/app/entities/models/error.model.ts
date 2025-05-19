import { errors as joseErrors } from 'jose';
import { ZodError } from 'zod';

import { LoggerClient } from 'src/clients/logger.client';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { StatusCode } from 'src/general/enums/status.enum';

export class ErrorModel extends Error {
  private static readonly logger = LoggerClient.instance;
  readonly statusCode: StatusCode;
  readonly detail: ClientErrorMessages;

  constructor(
    statusCode: StatusCode,
    message = 'Custom handled error',
    detail: ClientErrorMessages = ClientErrorMessages.DEFAULT,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.detail = detail;
  }

  static fromError(error: unknown): ErrorModel {
    switch (true) {
      case error instanceof ErrorModel:
        return error;

      case error instanceof ZodError:
        return this.generateFromZodError(error);

      case error instanceof joseErrors.JWTClaimValidationFailed:
        return this.generateInstanceAndLog(StatusCode.FORBIDDEN, error.message, ClientErrorMessages.JWE_TOKEN_INVALID);

      case error instanceof joseErrors.JOSEError:
        return this.generateInstanceAndLog(
          StatusCode.UNAUTHORIZED,
          error.message,
          ClientErrorMessages.JWE_TOKEN_INVALID,
        );

      case error instanceof Error:
        return this.generateInstanceAndLog(StatusCode.INTERNAL_SERVER_ERROR, error.message);

      default:
        return this.generateInstanceAndLog(StatusCode.INTERNAL_SERVER_ERROR, 'An unknown error occurred');
    }
  }

  static badRequest(detail?: ClientErrorMessages): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.BAD_REQUEST, undefined, detail);
  }
  static unauthorized(detail?: ClientErrorMessages): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.UNAUTHORIZED, undefined, detail);
  }
  static forbidden(detail?: ClientErrorMessages): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.FORBIDDEN, undefined, detail);
  }
  static notFound(detail?: ClientErrorMessages): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.NOT_FOUND, undefined, detail);
  }
  static conflict(detail?: ClientErrorMessages): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.CONFLICT, undefined, detail);
  }
  static unprocessable(detail?: ClientErrorMessages): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.UNPROCESSABLE_ENTITY, undefined, detail);
  }
  static locked(detail?: ClientErrorMessages): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.LOCKED, undefined, detail);
  }
  static server(detail?: ClientErrorMessages): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.INTERNAL_SERVER_ERROR, undefined, detail);
  }

  private static generateFromZodError(error: ZodError): ErrorModel {
    this.logger.error('Zod validation failed', { errors: error.errors });
    const validationDetails = error.errors.map((e) => `(${e.path.join('.') || 'root'}: ${e.message})`).join(', ');

    return this.generateInstanceAndLog(StatusCode.BAD_REQUEST, `Validation failed: ${validationDetails}`);
  }

  private static generateInstanceAndLog(
    statusCode: StatusCode,
    message?: string,
    detail?: ClientErrorMessages,
  ): ErrorModel {
    const errorInstance = new ErrorModel(statusCode, message, detail);
    const context = this.extractContextFromStack(errorInstance.stack);

    this.logger.error(`ErrorModel catched error`, {
      statusCode: errorInstance.statusCode,
      message: errorInstance.message,
      detail: errorInstance.detail,
      ...context,
    });

    return errorInstance;
  }

  private static extractContextFromStack(stack?: string): {
    callerLine?: string;
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
  } {
    if (!stack) return {};

    const lines = stack.split('\n');

    const callerLine = lines[3]?.trim();

    if (!callerLine) return {};

    const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
    if (!match) return { callerLine };

    const [, fileName, lineStr, columnStr] = match;
    const lineNumber = Number(lineStr);
    const columnNumber = Number(columnStr);

    return {
      callerLine,
      fileName,
      lineNumber,
      columnNumber,
    };
  }
}
