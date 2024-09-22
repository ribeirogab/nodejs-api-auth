import { inject, injectable } from 'tsyringe';

import type { EnvConfig, JwtConfig } from '@/configs';
import { AppErrorCodeEnum, HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import {
  type RegistrationConfirmServiceDto,
  type RegistrationConfirmService as RegistrationConfirmServiceInterface,
  type User,
  UserAuthProviderEnum,
  type UserAuthProviderRepository,
  type UserRepository,
  type VerificationCode,
  type VerificationCodeRepository,
  VerificationCodeTypeEnum,
} from '@/interfaces';

@injectable()
export class RegistrationConfirmService
  implements RegistrationConfirmServiceInterface
{
  constructor(
    @inject('UserAuthProviderRepository')
    private userAuthProviderRepository: UserAuthProviderRepository,

    @inject('VerificationCodeRepository')
    private verificationCodeRepository: VerificationCodeRepository,

    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('JwtConfig')
    private readonly jwtConfig: JwtConfig,

    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {}

  public async execute({
    token,
    code,
  }: RegistrationConfirmServiceDto): Promise<void> {
    const verificationCode = await this.getVerificationToken({ token });

    if (!verificationCode || verificationCode.code !== code) {
      throw new AppError({
        error_code: AppErrorCodeEnum.VerificationCodeInvalidOrExpired,
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message:
          'This code has been used or expired. Please go back to get a new code.',
      });
    }

    const parsedUser = this.parseUser(verificationCode);

    if (!parsedUser.email) {
      throw new AppError({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        error_code: AppErrorCodeEnum.Unknown,
        message: 'Invalid user data',
      });
    }

    const authProvider = await this.userAuthProviderRepository.findOne({
      provider: UserAuthProviderEnum.Email,
      provider_id: parsedUser.email,
    });

    if (authProvider) {
      throw new AppError({
        error_code: AppErrorCodeEnum.EmailAlreadyInUse,
        status_code: HttpStatusCodesEnum.CONFLICT,
        message: 'This email is already in use.',
      });
    }

    const user = await this.userRepository.create(parsedUser);

    await this.userAuthProviderRepository.create({
      provider: UserAuthProviderEnum.Email,
      provider_id: parsedUser.email,
      user_id: user.id,
    });

    await this.verificationCodeRepository.deleteOne({
      code_type: VerificationCodeTypeEnum.Registration,
      token,
    });
  }

  private async getVerificationToken({
    token,
  }: {
    token: string;
  }): Promise<VerificationCode | null> {
    const decoded = this.jwtConfig.verify<{ sub: string }>({
      secret: this.envConfig.JWT_SECRET_VERIFICATION_TOKEN,
      token,
    });

    if (!decoded) {
      throw new AppError({
        error_code: AppErrorCodeEnum.VerificationCodeInvalidOrExpired,
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message:
          'This code has been used or expired. Please go back to get a new code.',
      });
    }

    const verificationCode = await this.verificationCodeRepository.findOne({
      code_type: VerificationCodeTypeEnum.Registration,
      token,
    });

    return verificationCode;
  }

  private parseUser(verificationCode: VerificationCode): Omit<User, 'id'> {
    const userData =
      this.verificationCodeRepository.removeReservedFields<Omit<User, 'id'>>(
        verificationCode,
      );

    if (!userData.email) {
      throw new AppError({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        error_code: AppErrorCodeEnum.Unknown,
        message: 'Invalid user data',
      });
    }

    return userData as Omit<User, 'id'>;
  }
}
