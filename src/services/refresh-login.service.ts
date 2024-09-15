import { inject, injectable } from 'tsyringe';

import type { JwtConfig } from '@/configs';
import { HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import type {
  AuthHelper,
  RefreshLoginServiceDto,
  RefreshLoginService as RefreshLoginServiceInterface,
  Session,
  SessionRepository,
} from '@/interfaces';

@injectable()
export class RefreshLoginService implements RefreshLoginServiceInterface {
  constructor(
    @inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,

    @inject('JwtConfig')
    private readonly jwtConfig: JwtConfig,

    @inject('AuthHelper')
    private readonly authHelper: AuthHelper,
  ) {}

  public async execute({
    refresh_token: refreshToken,
  }: RefreshLoginServiceDto): Promise<Omit<Session, 'user_id'>> {
    const decodedToken = this.jwtConfig.verify<{ sub?: string }>(refreshToken);

    if (!decodedToken?.sub) {
      throw new AppError({
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    const session = await this.sessionRepository.findByUserId({
      user_id: decodedToken.sub,
    });

    if (
      !session ||
      session.refresh_token !== refreshToken ||
      new Date(session.expires_at) <= new Date()
    ) {
      throw new AppError({
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    const refreshedSession = await this.authHelper.createSession({
      user_id: session.user_id,
    });

    return refreshedSession;
  }
}
