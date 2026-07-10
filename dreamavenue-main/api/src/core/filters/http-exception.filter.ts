// filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../logger/winston.logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
      statusCode: status,
      message:
        exception instanceof BadRequestException
          ? (exception as any)?.response?.message
          : exception instanceof HttpException
            ? exception.message
            : 'Internal server error',
      stack: exception instanceof Error ? exception.stack : undefined,
      request: {
        headers: req.headers,
        query: req.query,
        body: req.body,
      },
    };

    logger.error(errorResponse);

    res.status(status).json({
      statusCode: status,
      message: errorResponse.message,
    });
  }
}
