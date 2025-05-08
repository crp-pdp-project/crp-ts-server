import { errors as joseErrors } from 'jose';
import { ZodError } from 'zod';

import { LoggerClient } from 'src/clients/logger.client';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';
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
    if (error instanceof ErrorModel) {
      this.logger.error('Re-thrown custom ErrorModel', {
        statusCode: error.statusCode,
        message: error.message,
        detail: error.detail,
      });

      return error;
    }

    if (error instanceof ZodError) {
      this.logger.error('Zod validation failed', {
        errors: error.errors,
      });

      return this.fromZod(error);
    }

    if (error instanceof joseErrors.JWTClaimValidationFailed) {
      this.logger.error('JWT claim validation failed', { message: error.message });

      return new ErrorModel(StatusCode.FORBIDDEN, error.message, ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    if (error instanceof joseErrors.JOSEError) {
      this.logger.error('JWT validation failed', { message: error.message });

      return new ErrorModel(StatusCode.UNAUTHORIZED, error.message, ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    if (error instanceof Error) {
      this.logger.error('Unhandled application error', {
        message: error.message,
        stack: error.stack,
      });

      return new ErrorModel(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    }

    this.logger.error('Unknown application error', { error });

    return new ErrorModel(StatusCode.INTERNAL_SERVER_ERROR, 'An unknown error occurred');
  }

  private static fromZod(error: ZodError): ErrorModel {
    const validationDetails = error.errors.map((e) => `(${e.path.join('.') || 'root'}: ${e.message})`).join(', ');

    return new ErrorModel(StatusCode.BAD_REQUEST, `Validation failed: ${validationDetails}`);
  }

  static badRequest(detail?: ClientErrorMessages): ErrorModel {
    return new ErrorModel(StatusCode.BAD_REQUEST, undefined, detail);
  }
  static unauthorized(detail?: ClientErrorMessages): ErrorModel {
    return new ErrorModel(StatusCode.UNAUTHORIZED, undefined, detail);
  }
  static forbidden(detail?: ClientErrorMessages): ErrorModel {
    return new ErrorModel(StatusCode.FORBIDDEN, undefined, detail);
  }
  static notFound(detail?: ClientErrorMessages): ErrorModel {
    return new ErrorModel(StatusCode.NOT_FOUND, undefined, detail);
  }
  static conflict(detail?: ClientErrorMessages): ErrorModel {
    return new ErrorModel(StatusCode.CONFLICT, undefined, detail);
  }
  static unprocessable(detail?: ClientErrorMessages): ErrorModel {
    return new ErrorModel(StatusCode.UNPROCESSABLE_ENTITY, undefined, detail);
  }
  static locked(detail?: ClientErrorMessages): ErrorModel {
    return new ErrorModel(StatusCode.LOCKED, undefined, detail);
  }
  static server(detail?: ClientErrorMessages): ErrorModel {
    return new ErrorModel(StatusCode.INTERNAL_SERVER_ERROR, undefined, detail);
  }
}
