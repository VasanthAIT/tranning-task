import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.originalUrl}`);
    console.log(`Body:`, req.body);
    console.log(`Query:`, req.query);
    console.log(`Params:`, req.params);
    next();
  }
}
