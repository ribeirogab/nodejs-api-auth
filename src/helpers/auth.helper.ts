import { inject, injectable } from 'tsyringe';

import type { JwtConfig } from '@/configs';
import type {
  AuthHelperGenerateSessionDto,
  AuthHelper as AuthHelperInterface,
  AuthenticationSession,
  SessionRepository,
} from '@/interfaces';

@injectable()
export class AuthHelper implements AuthHelperInterface {
  constructor(
    @inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,

    @inject('JwtConfig')
    private readonly jwtConfig: JwtConfig,
  ) {}

  public async createSession({
    provider,
    user_id,
  }: AuthHelperGenerateSessionDto): Promise<AuthenticationSession> {
    const accessToken = this.jwtConfig.sign({
      expiresIn: '15m',
      subject: user_id,
    });

    const expirationTimeInMinutes = 15;
    const expiresAt = new Date(
      Date.now() + expirationTimeInMinutes * 60 * 1000,
    ).toISOString();

    const refreshToken = this.jwtConfig.sign({
      expiresIn: '7d',
      subject: user_id,
    });

    const session = await this.sessionRepository.upsert({
      refresh_token: refreshToken,
      access_token: accessToken,
      expires_at: expiresAt,
      provider,
      user_id,
    });

    return {
      refresh_token: session.refresh_token,
      access_token: session.access_token,
      expires_at: session.expires_at,
    };
  }
}
