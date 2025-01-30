import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {
        const logger = new Logger('HTTP');
        const { method, originalUrl, body, query, params } = req;
        const userAgent = req.headers['user-agent'] || '';
        const ip = req.ip;

        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;
            const { statusCode } = res;

            logger.log(
                `📝 ${method} ${originalUrl} [${statusCode}] - ${duration}ms - IP: ${ip} - Agent: ${userAgent}`,
            );

            logger.debug(`📥 Request: ${JSON.stringify({ method, originalUrl, body, query, params })}`);
        });

        next();
    }
}