import type { FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { HookMiddleware, LoggerAdapter } from '@/interfaces';

@injectable()
export class RequestAuditMiddleware implements HookMiddleware {
  private readonly sensitiveFields = ['refresh_token', 'password', 'token'];

  constructor(@inject('LoggerAdapter') private logger: LoggerAdapter) {
    this.logger = this.logger.setPrefix(
      this.logger,
      RequestAuditMiddleware.name,
    );
  }

  public async middleware(request: FastifyRequest): Promise<void> {
    this.logger.debug('Request audit:', {
      timestamp: new Date().toISOString(),
      routerPath: request.routeOptions.url,
      originalUrl: request.originalUrl,
      hostname: request.hostname,
      method: request.method,
      url: request.url,

      params: this.cleanSensitiveData(request.params),
      query: this.cleanSensitiveData(request.query),
      body: this.cleanSensitiveData(request.body),

      headers: {
        'user-agent': request.headers['user-agent'],
        referer: request.headers.referer,
      },

      connection: {
        remoteAddress: request.socket.remoteAddress,
        remotePort: request.socket.remotePort,
        ip: request.ip,
      },
    });
  }

  private cleanSensitiveData(data: unknown): unknown {
    const cleanDataRecursively = (
      obj: Record<string, unknown>,
    ): Record<string, unknown> => {
      const cleanedData = { ...obj };

      for (const key in cleanedData) {
        if (this.sensitiveFields.includes(key)) {
          cleanedData[key] = '[REDACTED]';
        } else if (
          typeof cleanedData[key] === 'object' &&
          cleanedData[key] !== null
        ) {
          cleanedData[key] = cleanDataRecursively(
            cleanedData[key] as Record<string, unknown>,
          );
        }
      }

      return cleanedData;
    };

    return cleanDataRecursively(data as Record<string, unknown>);
  }
}
