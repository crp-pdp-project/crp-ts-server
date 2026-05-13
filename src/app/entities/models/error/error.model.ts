import { errors as joseErrors } from 'jose';
import { ZodError } from 'zod';

import { LoggerClient } from 'src/clients/logger/logger.client';
import { ErrorConstants } from 'src/general/contants/error.contants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { StatusCode } from 'src/general/enums/status.enum';

export type ErrorOptions = {
  detail?: ClientErrorMessages | string;
  message?: string;
};

export type GenerateInstanceOptions = {
  statusCode: StatusCode;
  message?: string;
  detail?: ClientErrorMessages | string;
  originalError?: unknown;
};

export class ErrorModel extends Error {
  private static readonly logger = LoggerClient.instance;
  readonly statusCode: StatusCode;
  readonly detail: ClientErrorMessages | string;

  constructor(
    statusCode: StatusCode,
    message = 'Custom handled error',
    detail: ClientErrorMessages | string = ClientErrorMessages.DEFAULT,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;

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
        return this.generateInstanceAndLog({
          statusCode: StatusCode.FORBIDDEN,
          message: error.message,
          detail: ClientErrorMessages.JWE_TOKEN_INVALID,
          originalError: error,
        });

      case error instanceof joseErrors.JOSEError:
        return this.generateInstanceAndLog({
          statusCode: StatusCode.UNAUTHORIZED,
          message: error.message,
          detail: ClientErrorMessages.JWE_TOKEN_INVALID,
          originalError: error,
        });

      case error instanceof Error:
        return this.generateInstanceAndLog({
          statusCode: StatusCode.INTERNAL_SERVER_ERROR,
          message: error.message,
          originalError: error,
        });

      default:
        return this.generateInstanceAndLog({
          statusCode: StatusCode.INTERNAL_SERVER_ERROR,
          message: 'An unknown error occurred',
        });
    }
  }

  static badRequest(options?: ErrorOptions): ErrorModel {
    return this.generateInstanceAndLog({
      statusCode: StatusCode.BAD_REQUEST,
      message: options?.message,
      detail: options?.detail,
    });
  }
  static unauthorized(options?: ErrorOptions): ErrorModel {
    return this.generateInstanceAndLog({
      statusCode: StatusCode.UNAUTHORIZED,
      message: options?.message,
      detail: options?.detail,
    });
  }
  static forbidden(options?: ErrorOptions): ErrorModel {
    return this.generateInstanceAndLog({
      statusCode: StatusCode.FORBIDDEN,
      message: options?.message,
      detail: options?.detail,
    });
  }
  static notFound(options?: ErrorOptions): ErrorModel {
    return this.generateInstanceAndLog({
      statusCode: StatusCode.NOT_FOUND,
      message: options?.message,
      detail: options?.detail,
    });
  }
  static conflict(options?: ErrorOptions): ErrorModel {
    return this.generateInstanceAndLog({
      statusCode: StatusCode.CONFLICT,
      message: options?.message,
      detail: options?.detail,
    });
  }
  static unprocessable(options?: ErrorOptions): ErrorModel {
    return this.generateInstanceAndLog({
      statusCode: StatusCode.UNPROCESSABLE_ENTITY,
      message: options?.message,
      detail: options?.detail,
    });
  }
  static locked(options?: ErrorOptions): ErrorModel {
    return this.generateInstanceAndLog({
      statusCode: StatusCode.LOCKED,
      message: options?.message,
      detail: options?.detail,
    });
  }
  static precondition(options?: ErrorOptions): ErrorModel {
    return this.generateInstanceAndLog({
      statusCode: StatusCode.PRECONDITION_REQUIRED,
      message: options?.message,
      detail: options?.detail,
    });
  }
  static server(options?: ErrorOptions): ErrorModel {
    return this.generateInstanceAndLog({
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      message: options?.message,
      detail: options?.detail,
    });
  }
  static timeout(options?: ErrorOptions): ErrorModel {
    return this.generateInstanceAndLog({
      statusCode: StatusCode.GATEWAY_TIMEOUT,
      message: options?.message,
      detail: options?.detail,
    });
  }

  private static generateFromZodError(error: ZodError): ErrorModel {
    this.logger.error('Zod validation failed', { errors: error.issues });
    const validationDetails = error.issues.map((e) => `(${e.path.join('.') || 'root'}: ${e.message})`).join(', ');

    return this.generateInstanceAndLog({
      statusCode: StatusCode.BAD_REQUEST,
      message: `Validation failed: ${validationDetails}`,
      originalError: error,
    });
  }

  private static generateInstanceAndLog(options: GenerateInstanceOptions): ErrorModel {
    const { statusCode, message, detail, originalError } = options;
    const errorInstance = new ErrorModel(statusCode, message, detail);
    errorInstance.stack = this.resolveStack(errorInstance, originalError);
    const summary = this.summarizeStack(errorInstance.stack);

    this.logger.error('ErrorModel caught error', {
      statusCode: errorInstance.statusCode,
      message: errorInstance.message,
      detail: errorInstance.detail,
      summary,
    });

    return errorInstance;
  }

  private static resolveStack(errorInstance: ErrorModel, originalError?: unknown): string | undefined {
    const baseStack = originalError instanceof Error ? originalError.stack : errorInstance.stack;
    return baseStack ? this.cleanStack(baseStack) : undefined;
  }

  private static cleanStack(stack: string): string {
    const cwd = `${process.cwd()}/`;

    return stack
      .split('\n')
      .filter((line) => !ErrorConstants.INTERNAL_STACK_PATTERNS.some((pattern) => pattern.test(line.trim())))
      .map((line) => line.replace(cwd, ''))
      .join('\n');
  }

  private static summarizeStack(stack?: string): string[] {
    if (!stack) {
      return [];
    }

    return stack
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, ErrorConstants.STACK_SUMMARY_LINES);
  }
}
