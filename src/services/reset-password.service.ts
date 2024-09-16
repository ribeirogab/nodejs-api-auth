import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import {
  type HashAdapter,
  type ResetPasswordServiceDto,
  type ResetPasswordService as ResetPasswordServiceInterface,
  type UserRepository,
  type VerificationCodeRepository,
  VerificationCodeTypeEnum,
} from '@/interfaces';

@injectable()
export class ResetPasswordService implements ResetPasswordServiceInterface {
  constructor(
    @inject('VerificationCodeRepository')
    private readonly verificationCodeRepository: VerificationCodeRepository,

    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('HashAdapter')
    private readonly hashAdapter: HashAdapter,
  ) {}

  public async execute({
    password,
    email,
    code,
  }: ResetPasswordServiceDto): Promise<void> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      type: VerificationCodeTypeEnum.RecoveryPassword,
      code,
    });

    if (!verificationCode || verificationCode.content.email !== email) {
      throw new AppError({
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    const salt = this.hashAdapter.generateSalt();
    const hashedPassword = this.hashAdapter.hash({
      text: password,
      salt,
    });

    await this.userRepository.updateByEmail({
      email,
      update: {
        password: hashedPassword,
        password_salt: salt,
      },
    });
  }
}
