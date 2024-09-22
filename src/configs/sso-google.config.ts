import oauth2, { FastifyOAuth2Options, OAuth2Namespace } from '@fastify/oauth2';
import axios, { type AxiosInstance } from 'axios';
import { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { EnvConfig } from './env.config';
import { type SingleSignOnService, UserAuthProviderEnum } from '@/interfaces';

type FastifyApp = FastifyInstance & {
  googleOAuth2: OAuth2Namespace;
};

export type GoogleUserInfo = {
  verified_email: boolean;
  family_name?: string;
  given_name?: string;
  picture?: string;
  email: string;
  name: string;
  id: string;
};

@injectable()
export class SSOGoogleConfig {
  private readonly api: AxiosInstance;

  constructor(
    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,

    @inject('SingleSignOnService')
    private readonly singleSignOnService: SingleSignOnService,
  ) {
    this.api = axios.create({
      baseURL: 'https://www.googleapis.com',
    });
  }

  public setup(app: FastifyInstance) {
    app.register(oauth2, {
      callbackUri: `${this.envConfig.APPLICATION_BASE_URL}/v1/auth/google/callback`,
      scope: ['profile', 'email'],
      name: 'googleOAuth2',
      credentials: {
        client: {
          secret: this.envConfig.GOOGLE_CLIENT_SECRET,
          id: this.envConfig.GOOGLE_CLIENT_ID,
        },
        auth: oauth2.GOOGLE_CONFIGURATION,
      },
    } as FastifyOAuth2Options);

    app.after(() => {
      this.routers(app as FastifyApp);
    });
  }

  private routers(app: FastifyApp) {
    app.get('/v1/auth/google', async (request, reply) => {
      const redirectUrl = await app.googleOAuth2.generateAuthorizationUri(
        request,
        reply,
      );

      return reply.redirect(redirectUrl);
    });

    app.get('/v1/auth/google/callback', async (request, reply) => {
      const { token } =
        await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

      const { data } = await this.api.get<GoogleUserInfo>(
        '/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      );

      const response = await this.singleSignOnService.execute({
        provider: UserAuthProviderEnum.Google,
        providerId: data.id,
        email: data.email,
        name: data.name,
      });

      return reply.send(response);
    });
  }
}
