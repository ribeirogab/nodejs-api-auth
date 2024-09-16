import { inject, injectable } from 'tsyringe';

import { AppErrorCodeEnum, HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import {
  type RegistrationConfirmServiceDto,
  type RegistrationConfirmService as RegistrationConfirmServiceInterface,
  type User,
  type UserRepository,
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
  ) {}

  public async execute({ code }: RegistrationConfirmServiceDto): Promise<void> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      type: VerificationCodeTypeEnum.Registration,
      code,
    });

    if (!verificationCode) {
      throw new AppError({
        message: AppErrorCodeEnum.VerificationCodeNotFound,
        status_code: HttpStatusCodesEnum.NOT_FOUND,
      });
    }

    const user = this.parseUser(verificationCode.content);

    const userExists = await this.userRepository.findByEmail({
      email: user.email,
    });

    if (userExists) {
      throw new AppError({
        message: AppErrorCodeEnum.EmailAlreadyInUse,
        status_code: HttpStatusCodesEnum.CONFLICT,
      });
    }

    await this.userRepository.create(user);
  }

  private parseUser(
    content: Record<string, string | number>,
  ): Omit<User, 'id'> {
    const user = content as Omit<User, 'id'>;

    return user;
  }
}
