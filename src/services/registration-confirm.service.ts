import { inject, injectable } from 'tsyringe';

import type { EnvConfig, JwtConfig } from '@/configs';
import { AppErrorCodeEnum, HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import {
  type RegistrationConfirmServiceDto,
  type RegistrationConfirmService as RegistrationConfirmServiceInterface,
  type User,
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
    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('VerificationCodeRepository')
    private verificationCodeRepository: VerificationCodeRepository,

    @inject('JwtConfig')
    private readonly jwtConfig: JwtConfig,

    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {}

  public async execute({
    token,
    code,
  }: RegistrationConfirmServiceDto): Promise<void> {
    this.jwtConfig.verify<{ sub: string }>({ token });

    const verificationCode = await this.getVerificationToken({ token });

    if (!verificationCode || verificationCode.code !== code) {
      throw new AppError({
        error_code: AppErrorCodeEnum.VerificationCodeInvalidOrExpired,
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message:
          'This code has been used or expired. Please go back to get a new code.',
      });
    }

    const user = this.parseUser(verificationCode);

    const userExists = await this.userRepository.findByEmail({
      email: user.email,
    });

    if (userExists) {
      throw new AppError({
        error_code: AppErrorCodeEnum.EmailAlreadyInUse,
        status_code: HttpStatusCodesEnum.CONFLICT,
        message: 'This email is already in use.',
      });
    }

    await this.userRepository.create(user);

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

    return userData as Omit<User, 'id'>;
  }
}
