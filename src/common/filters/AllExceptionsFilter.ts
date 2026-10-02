import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import type { Request, Response } from 'express';
import { STATUS_CODES } from 'node:http';

import type { TApiErrorDetail, TApiErrorResponse } from '@/common/types';

const VALIDATION_MESSAGE = 'Validation failed';
const INTERNAL_MESSAGE = 'Internal server error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const { message, errors } = this.extractMessage(exception);

    const body: TApiErrorResponse = {
      path: request.url,
      timestamp: new Date().toISOString(),
      success: false,
      statusCode,
      error: STATUS_CODES[statusCode] ?? 'Error',
      message,
      ...(errors && { errors }),
    };

    response.status(statusCode).json(body);
  }

  private extractMessage(exception: unknown): {
    message: string;
    errors?: TApiErrorDetail[];
  } {
    if (!(exception instanceof HttpException)) {
      return { message: INTERNAL_MESSAGE };
    }

    const res = exception.getResponse();

    if (typeof res === 'string') return { message: res };

    const raw = (res as { message?: unknown }).message;

    if (Array.isArray(raw)) {
      return {
        message: VALIDATION_MESSAGE,
        errors: raw.map((item: unknown) =>
          typeof item === 'string'
            ? { message: item }
            : (item as TApiErrorDetail),
        ),
      };
    }

    return { message: typeof raw === 'string' ? raw : exception.message };
  }
}
