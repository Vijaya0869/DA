import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogViewerAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl.startsWith('/log-viewer')) {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return this.unauthorized(res);
      }

      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'ascii',
      );
      const [username, password] = credentials.split(':');

      const validUser = process.env.LOG_VIEWER_USER;
      const validPass = process.env.LOG_VIEWER_PASS;

      if (username !== validUser || password !== validPass) {
        return this.unauthorized(res);
      }
    }

    next();
  }

  private unauthorized(res: Response) {
    res.set('WWW-Authenticate', 'Basic realm="Log Viewer"');
    return res.status(401).send('Authentication required.');
  }
}
