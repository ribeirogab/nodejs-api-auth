import { inject, injectable } from 'tsyringe';

import type { JwtConfig } from '@/configs';
import type {
  AuthHelperGenerateSessionDto,
  AuthHelper as AuthHelperInterface,
  Session,
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
    user_id,
  }: AuthHelperGenerateSessionDto): Promise<Session> {
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
      user_id,
    });

    return session;
  }
}
