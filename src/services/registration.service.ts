import { inject, injectable } from 'tsyringe';

import type { EnvConfig, JwtConfig } from '@/configs';
import { AppErrorCodeEnum, HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import {
  type EmailAdapter,
  EmailTemplateEnum,
  type EmailTemplateRepository,
  type RegistrationServiceDto,
  type RegistrationService as RegistrationServiceInterface,
  type User,
  type UserRepository,
  type VerificationCodeRepository,
  VerificationCodeTypeEnum,
} from '@/interfaces';

@injectable()
export class RegistrationService implements RegistrationServiceInterface {
  constructor(
    @inject('EmailTemplateRepository')
    private readonly emailTemplateRepository: EmailTemplateRepository,

    @inject('VerificationCodeRepository')
    private verificationCodeRepository: VerificationCodeRepository,

    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('EmailAdapter')
    private readonly emailAdapter: EmailAdapter,

    @inject('JwtConfig')
    private readonly jwtConfig: JwtConfig,

    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {}

  public async execute({
    email,
    name,
  }: RegistrationServiceDto): Promise<{ token: string }> {
    const userExists = await this.userRepository.findByEmail({
      email,
    });

    if (userExists) {
      throw new AppError({
        error_code: AppErrorCodeEnum.EmailAlreadyInUse,
        status_code: HttpStatusCodesEnum.CONFLICT,
        message: 'This email is already in use.',
      });
    }

    const verificationCodeExists =
      await this.verificationCodeRepository.findOneByContent({
        code_type: VerificationCodeTypeEnum.Registration,
        content: { key: 'email', value: email },
      });

    if (verificationCodeExists) {
      await this.verificationCodeRepository.deleteOne({
        code_type: VerificationCodeTypeEnum.Registration,
        token: verificationCodeExists.token,
      });
    }

    const content: Omit<User, 'id'> = {
      email,
      name,
    };

    const expirationTimeInMinutes = 60; // 1 hour
    const expiresAt = new Date(
      Date.now() + expirationTimeInMinutes * 60 * 1000,
    ).toISOString();

    const token = this.jwtConfig.sign({
      secret: this.envConfig.JWT_SECRET_VERIFICATION_TOKEN,
      expiresIn: '1h',
      subject: email,
    });

    const verificationCode = await this.verificationCodeRepository.create({
      code_type: VerificationCodeTypeEnum.Registration,
      code_expires_at: expiresAt,
      content,
      token,
    });

    await this.sendVerificationEmail({
      code: verificationCode.code,
      token,
      email,
    });

    return { token };
  }

  private async sendVerificationEmail({
    token,
    email,
    code,
  }: {
    token: string;
    email: string;
    code: string;
  }) {
    const confirmLink = `${this.envConfig.FRONTEND_CONFIRM_SIGN_UP_URL}/?token=${token}`;

    const template = this.emailTemplateRepository.getTemplate({
      template: EmailTemplateEnum.SignUp,
      variables: {
        [EmailTemplateEnum.SignUp]: { confirmLink, code },
      },
    });

    await this.emailAdapter.send({
      subject: template.subject,
      html: template.html,
      to: email,
    });
  }
}
