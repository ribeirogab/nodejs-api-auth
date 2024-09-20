import { inject, injectable } from 'tsyringe';

import {
  type EmailAdapter,
  type RecoveryPasswordServiceDto,
  type RecoveryPasswordService as RecoveryPasswordServiceInterface,
  type UserRepository,
  type VerificationCodeRepository,
  VerificationCodeTypeEnum,
} from '@/interfaces';

@injectable()
export class RecoveryPasswordService
  implements RecoveryPasswordServiceInterface
{
  constructor(
    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('VerificationCodeRepository')
    private readonly verificationCodeRepository: VerificationCodeRepository,

    @inject('EmailAdapter')
    private readonly emailAdapter: EmailAdapter,
  ) {}

  public async execute({ email }: RecoveryPasswordServiceDto): Promise<void> {
    const user = await this.userRepository.findByEmail({ email });

    if (!user) {
      return;
    }

    const verificationCodeExists =
      await this.verificationCodeRepository.findOneByContent({
        code_type: VerificationCodeTypeEnum.RecoveryPassword,
        content: { key: 'email', value: email },
      });

    if (verificationCodeExists) {
      await this.verificationCodeRepository.deleteOne({
        code: verificationCodeExists.code,
        code_type: VerificationCodeTypeEnum.RecoveryPassword,
      });
    }

    const expirationTimeInMinutes = 10;
    const expiresAt = new Date(
      Date.now() + expirationTimeInMinutes * 60 * 1000,
    ).toISOString();

    const verificationCode = await this.verificationCodeRepository.create({
      code_type: VerificationCodeTypeEnum.RecoveryPassword,
      code_expires_at: expiresAt,
      content: { email },
    });

    await this.emailAdapter.send({
      to: email,
      subject: 'Recovery password',
      html: `${verificationCode}`,
    });
  }
}
