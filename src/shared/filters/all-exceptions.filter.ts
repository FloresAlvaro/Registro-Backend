import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path: string;
  details?: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else {
        const responseObj = exceptionResponse as Record<string, unknown>;

        message = (responseObj.message as string) || exception.message;

        error = (responseObj.error as string) || exception.name;

        details = responseObj.details;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = this.getPrismaErrorStatus(exception);
      message = this.getPrismaErrorMessage(exception);
      error = 'Database Error';
      details = {
        code: exception.code,
        field: exception.meta?.target,
      };
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data provided';
      error = 'Validation Error';
      details = {
        originalError: exception.message,
      };
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
      error = exception.name;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Unknown error occurred';
      error = 'Internal Server Error';
    }

    const errorResponse: ErrorResponse = {
      success: false,
      message,
      error,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Add details if they exist
    if (details) {
      (errorResponse as ErrorResponse & { details: unknown }).details = details;
    }

    const logContext = exception instanceof Error ? exception.stack : exception;

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      logContext,
    );

    response.status(status).json(errorResponse);
  }

  private getPrismaErrorStatus(
    error: Prisma.PrismaClientKnownRequestError,
  ): number {
    switch (error.code) {
      case 'P2000': // Value too long
      case 'P2001': // Record not found
        return HttpStatus.NOT_FOUND;
      case 'P2002': // Unique constraint violation
        return HttpStatus.CONFLICT;
      case 'P2003': // Foreign key constraint violation
        return HttpStatus.BAD_REQUEST;
      case 'P2025': // Record not found (delete/update)
        return HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getPrismaErrorMessage(
    error: Prisma.PrismaClientKnownRequestError,
  ): string {
    const target = error.meta?.target as string | undefined;
    switch (error.code) {
      case 'P2000':
        return 'The provided value is too long for the database field';
      case 'P2001':
        return 'The requested record was not found';
      case 'P2002':
        return `A record with this ${target || 'field'} already exists`;
      case 'P2003':
        return 'This operation violates a foreign key constraint';
      case 'P2025':
        return 'The record you are trying to modify was not found';
      default:
        return 'A database error occurred';
    }
  }
}
