import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import type { EnvConfig } from './env.config';

type SignInDto = {
  /**
   * Expressed in seconds or a string describing a time span (zeit/ms).
   * E.g.: 60, "2 days", "10h", "7d"
   */
  expiresIn?: string | number;
  subject?: string;
};

@injectable()
export class JwtConfig {
  constructor(@inject('EnvConfig') private readonly envConfig: EnvConfig) {}

  public sign({ expiresIn, subject }: SignInDto) {
    return sign({}, this.envConfig.JWT_SECRET, {
      expiresIn,
      subject,
    });
  }

  public verify(token: string) {
    return verify(token, this.envConfig.JWT_SECRET);
  }
}
