import type { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { EnvConfig } from './env.config';
import { SSOGoogleConfig } from './sso-google.config';

@injectable()
export class SSOConfig {
  constructor(
    @inject('SSOGoogleConfig')
    private readonly ssoGoogleConfig: SSOGoogleConfig,

    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {}

  public plugin(
    app: FastifyInstance,
    _options?: unknown,
    done?: (err?: Error) => void,
  ) {
    if (this.envConfig.GOOGLE_SSO_ENABLED) {
      this.ssoGoogleConfig.setup(app);
    }

    if (done) {
      done();
    }
  }
}
