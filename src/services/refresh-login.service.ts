import { inject, injectable } from 'tsyringe';

import type { JwtConfig } from '@/configs';
import { HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import type {
  AuthHelper,
  AuthenticationSession,
  LoggerAdapter,
  RefreshLoginServiceDto,
  RefreshLoginService as RefreshLoginServiceInterface,
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

    @inject('LoggerAdapter')
    private readonly logger: LoggerAdapter,
  ) {}

  public async execute({
    refresh_token: refreshToken,
  }: RefreshLoginServiceDto): Promise<AuthenticationSession> {
    const userId = this.getUserId({ refreshToken });

    const session = await this.sessionRepository.findByUserId({
      user_id: userId,
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
      provider: session.provider,
      user_id: session.user_id,
    });

    return refreshedSession;
  }

  private getUserId({ refreshToken }: { refreshToken: string }): string {
    try {
      const decodedToken = this.jwtConfig.verify<{ sub?: string }>({
        token: refreshToken,
      });

      if (!decodedToken?.sub) {
        throw new AppError({
          status_code: HttpStatusCodesEnum.UNAUTHORIZED,
          message: 'Unauthorized',
        });
      }

      return decodedToken.sub;
    } catch (error) {
      this.logger.error('Error while verifying token', error);

      throw new AppError({
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }
  }
}
