import { inject, injectable } from 'tsyringe';

import type { EnvConfig, JwtConfig } from '@/configs';
import { AppErrorCodeEnum, HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import {
  type AuthHelper,
  type AuthenticationSession,
  type LoginConfirmServiceDto,
  type LoginConfirmService as LoginConfirmServiceInterface,
  UserAuthProviderEnum,
  type UserAuthProviderRepository,
  type UserRepository,
  type VerificationCodeRepository,
  VerificationCodeTypeEnum,
} from '@/interfaces';

@injectable()
export class LoginConfirmService implements LoginConfirmServiceInterface {
  constructor(
    @inject('UserAuthProviderRepository')
    private readonly userAuthProviderRepository: UserAuthProviderRepository,

    @inject('VerificationCodeRepository')
    private verificationCodeRepository: VerificationCodeRepository,

    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('AuthHelper')
    private readonly authHelper: AuthHelper,

    @inject('JwtConfig')
    private readonly jwtConfig: JwtConfig,

    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {}

  private get genericAuthError() {
    return new AppError({
      status_code: HttpStatusCodesEnum.UNAUTHORIZED,
      error_code: AppErrorCodeEnum.InvalidLogin,
      message: 'Unauthorized',
    });
  }

  public async execute({
    token,
    code,
  }: LoginConfirmServiceDto): Promise<AuthenticationSession> {
    const decoded = this.jwtConfig.verify<{ sub: string }>({
      secret: this.envConfig.JWT_SECRET_VERIFICATION_TOKEN,
      token,
    });

    if (!decoded) {
      throw this.genericAuthError;
    }

    const verificationCode = await this.verificationCodeRepository.findOne({
      code_type: VerificationCodeTypeEnum.Login,
      token,
    });

    if (!verificationCode || verificationCode.code !== code) {
      throw this.genericAuthError;
    }

    const authProvider = await this.userAuthProviderRepository.findOne({
      provider: UserAuthProviderEnum.Email,
      provider_id: decoded.sub,
    });

    if (!authProvider) {
      throw this.genericAuthError;
    }

    const user = await this.userRepository.findOne({
      id: authProvider.user_id,
    });

    if (!user) {
      throw this.genericAuthError;
    }

    const session = await this.authHelper.createSession({
      provider: UserAuthProviderEnum.Email,
      user_id: user.id,
    });

    await this.verificationCodeRepository.deleteOne({
      code_type: VerificationCodeTypeEnum.Login,
      token,
    });

    return {
      refresh_token: session.refresh_token,
      access_token: session.access_token,
      expires_at: session.expires_at,
    };
  }
}
