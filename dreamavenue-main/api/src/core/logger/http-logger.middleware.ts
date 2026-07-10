import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from './winston.logger';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/log-viewer') || req.path === '/log-viewer.html') {
      return next();
    }

    const requestId = uuidv4();
    const start = Date.now();
    const { method, originalUrl, headers, query, body } = req;

    let responseBody: any;

    // Intercept res.send to capture response body
    const originalSend = res.send.bind(res);
    res.send = (body: any) => {
      responseBody = body;
      return originalSend(body);
    };

    res.on('finish', () => {
      const duration = Date.now() - start;
      const log = {
        id: requestId,
        timestamp: new Date().toISOString(),
        method,
        url: originalUrl,
        statusCode: res.statusCode,
        duration,
        request: {
          headers,
          query,
          body,
        },
        response: {
          headers: res.getHeaders(),
          body: parseBody(responseBody),
        },
      };
      logger.info(log);
    });

    next();
  }
}

// Optional: handle circular structures or Buffers
function parseBody(body: any) {
  try {
    if (typeof body === 'string') return body;
    if (Buffer.isBuffer(body)) return body.toString();
    return JSON.parse(JSON.stringify(body));
  } catch (e) {
    return '[unserializable body]';
  }
}
