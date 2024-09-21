import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import type { EnvConfig } from './env.config';
import type { LoggerAdapter } from '@/interfaces';

type SignInDto = {
  /**
   * Expressed in seconds or a string describing a time span (zeit/ms).
   * E.g.: 60, "2 days", "10h", "7d"
   */
  expiresIn?: string | number;
  subject?: string;
  secret?: string;
};

@injectable()
export class JwtConfig {
  constructor(
    @inject('LoggerAdapter') private readonly logger: LoggerAdapter,

    @inject('EnvConfig') private readonly envConfig: EnvConfig,
  ) {
    this.logger = this.logger.setPrefix(this.logger, JwtConfig.name);
  }

  public sign({ expiresIn, subject, secret }: SignInDto) {
    return sign({}, secret || this.envConfig.JWT_SECRET, {
      expiresIn,
      subject,
    });
  }

  public verify<T>({
    token,
    secret,
  }: {
    token: string;
    secret?: string;
  }): T | null {
    try {
      return verify(token, secret || this.envConfig.JWT_SECRET) as T;
    } catch (error) {
      this.logger.error('Error while verifying token', error);

      return null;
    }
  }
}
