import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error = 'Internal Server Error';
    let details: Record<string, string> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const body = exceptionResponse as {
          message?: string | string[];
          error?: string;
          statusCode?: number;
        };

        if (Array.isArray(body.message)) {
          message = 'Datos de entrada inválidos';
          details = this.extractValidationErrors(body.message);
        } else {
          message = body.message ?? exception.message;
        }

        error = body.error ?? this.getErrorName(status);
      } else {
        message = exception.message;
        error = this.getErrorName(status);
      }
    }

    const errorResponse: ErrorResponse = {
      timestamp: new Date().toISOString(),
      status,
      error,
      message,
      path: request.url,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }

  private extractValidationErrors(messages: string[]): Record<string, string> {
    const errors: Record<string, string> = {};
    messages.forEach((message) => {
      const field = this.extractFieldFromMessage(message);
      errors[field] = message;
    });
    return errors;
  }

  private extractFieldFromMessage(message: string): string {
    return message.split(' ')[0];
  }

  private getErrorName(status: number): string {
    return HttpStatus[status] ?? 'Internal Server Error';
  }
}
