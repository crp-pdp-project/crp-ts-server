import { errors as joseErrors } from 'jose';
import { ZodError } from 'zod';

import { LoggerClient } from 'src/clients/logger/logger.client';
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

  static badRequest(options?: { detail?: ClientErrorMessages; message?: string }): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.BAD_REQUEST, options?.message, options?.detail);
  }
  static unauthorized(options?: { detail?: ClientErrorMessages; message?: string }): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.UNAUTHORIZED, options?.message, options?.detail);
  }
  static forbidden(options?: { detail?: ClientErrorMessages; message?: string }): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.FORBIDDEN, options?.message, options?.detail);
  }
  static notFound(options?: { detail?: ClientErrorMessages; message?: string }): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.NOT_FOUND, options?.message, options?.detail);
  }
  static conflict(options?: { detail?: ClientErrorMessages; message?: string }): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.CONFLICT, options?.message, options?.detail);
  }
  static unprocessable(options?: { detail?: ClientErrorMessages; message?: string }): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.UNPROCESSABLE_ENTITY, options?.message, options?.detail);
  }
  static locked(options?: { detail?: ClientErrorMessages; message?: string }): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.LOCKED, options?.message, options?.detail);
  }
  static server(options?: { detail?: ClientErrorMessages; message?: string }): ErrorModel {
    return this.generateInstanceAndLog(StatusCode.INTERNAL_SERVER_ERROR, options?.message, options?.detail);
  }

  private static generateFromZodError(error: ZodError): ErrorModel {
    this.logger.error('Zod validation failed', { errors: error.issues });
    const validationDetails = error.issues.map((e) => `(${e.path.join('.') || 'root'}: ${e.message})`).join(', ');

    return this.generateInstanceAndLog(StatusCode.BAD_REQUEST, `Validation failed: ${validationDetails}`);
  }

  private static generateInstanceAndLog(
    statusCode: StatusCode,
    message?: string,
    detail?: ClientErrorMessages,
  ): ErrorModel {
    const errorInstance = new ErrorModel(statusCode, message, detail);
    const callerLine = this.extractCallerFromStack(errorInstance.stack);

    this.logger.error(`ErrorModel catched error`, {
      statusCode: errorInstance.statusCode,
      message: errorInstance.message,
      detail: errorInstance.detail,
      callerLine,
    });

    return errorInstance;
  }

  private static extractCallerFromStack(stack?: string): string {
    if (!stack) return '';

    const lines = stack.split('\n');
    const callerLine = lines[3]?.trim();

    return callerLine;
  }
}
