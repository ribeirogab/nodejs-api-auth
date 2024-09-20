import { inject, injectable } from 'tsyringe';

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
  ) {}

  public async execute({ code }: RegistrationConfirmServiceDto): Promise<void> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      code_type: VerificationCodeTypeEnum.Registration,
      code,
    });

    if (!verificationCode) {
      throw new AppError({
        message: AppErrorCodeEnum.VerificationCodeNotFound,
        status_code: HttpStatusCodesEnum.NOT_FOUND,
      });
    }

    const user = this.parseUser(verificationCode);

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

  private parseUser(verificationCode: VerificationCode): Omit<User, 'id'> {
    const userData =
      this.verificationCodeRepository.removeReservedFields<Omit<User, 'id'>>(
        verificationCode,
      );

    // To do: Validate the user data
    const user = userData as Omit<User, 'id'>;

    return user;
  }
}
