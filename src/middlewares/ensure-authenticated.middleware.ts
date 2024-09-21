import type { FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { JwtConfig } from '@/configs';
import { HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import type { HookMiddleware, LoggerAdapter } from '@/interfaces';

@injectable()
export class EnsureAuthenticatedMiddleware implements HookMiddleware {
  constructor(
    @inject('JwtConfig')
    private readonly jwtConfig: JwtConfig,

    @inject('LoggerAdapter')
    private logger: LoggerAdapter,
  ) {
    this.logger = this.logger.setPrefix(
      this.logger,
      EnsureAuthenticatedMiddleware.name,
    );
  }

  public async middleware(request: FastifyRequest): Promise<void> {
    const authorization = request.headers?.authorization;

    if (!authorization) {
      throw new AppError({
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    const [, token] = authorization.split(' ');

    try {
      const decoded = this.jwtConfig.verify<{ sub: string }>({ token });

      if (!decoded) {
        throw new AppError({
          status_code: HttpStatusCodesEnum.UNAUTHORIZED,
          message: 'Unauthorized',
        });
      }

      request.user = { id: decoded.sub };
    } catch (error) {
      this.logger.error('Error while verifying token', error);

      throw new AppError({
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }
  }
}
