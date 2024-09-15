import rateLimit, { type RateLimitPluginOptions } from '@fastify/rate-limit';
import { inject, injectable } from 'tsyringe';

import type { EnvConfig } from './env.config';
import { HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';

@injectable()
export class RateLimit {
  public readonly plugin = rateLimit;

  constructor(@inject('EnvConfig') private readonly envConfig: EnvConfig) {}

  public get options(): RateLimitPluginOptions {
    return {
      timeWindow: this.envConfig.RATE_LIMIT_TIME_WINDOW_MS,
      max: this.envConfig.RATE_LIMIT_MAX,
      global: true,
      errorResponseBuilder: () =>
        new AppError({
          status_code: HttpStatusCodesEnum.TOO_MANY_REQUESTS,
          message: 'Too many requests',
        }),
    };
  }
}
