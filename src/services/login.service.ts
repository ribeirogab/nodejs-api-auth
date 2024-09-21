import { inject, injectable } from 'tsyringe';

import type { EnvConfig, JwtConfig } from '@/configs';
import {
  type EmailAdapter,
  EmailTemplateEnum,
  type EmailTemplateRepository,
  type LoginServiceDto,
  type LoginService as LoginServiceInterface,
  type UserRepository,
  type VerificationCodeRepository,
  VerificationCodeTypeEnum,
} from '@/interfaces';

@injectable()
export class LoginService implements LoginServiceInterface {
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

  public async execute({ email }: LoginServiceDto): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail({ email });

    const token = this.jwtConfig.sign({
      secret: this.envConfig.JWT_SECRET_VERIFICATION_TOKEN,
      expiresIn: '10m',
      subject: email,
    });

    if (!user) {
      return { token };
    }

    const verificationCodeExists =
      await this.verificationCodeRepository.findOneByContent({
        code_type: VerificationCodeTypeEnum.Login,
        content: { key: 'email', value: email },
      });

    if (verificationCodeExists) {
      await this.verificationCodeRepository.deleteOne({
        code_type: VerificationCodeTypeEnum.Login,
        token: verificationCodeExists.token,
      });
    }

    const expirationTimeInMinutes = 10; // 10 minutes
    const expiresAt = new Date(
      Date.now() + expirationTimeInMinutes * 60 * 1000,
    ).toISOString();

    const verificationCode = await this.verificationCodeRepository.create({
      code_type: VerificationCodeTypeEnum.Login,
      code_expires_at: expiresAt,
      content: { email },
      token,
    });

    await this.sendVerificationEmail({
      code: verificationCode.code,
      username: user.name,
      token,
      email,
    });

    return { token };
  }

  private async sendVerificationEmail({
    username,
    token,
    email,
    code,
  }: {
    username: string;
    token: string;
    email: string;
    code: string;
  }) {
    const confirmLink = `${this.envConfig.FRONTEND_CONFIRM_SIGN_IN_URL}/?token=${token}`;

    const template = this.emailTemplateRepository.getTemplate({
      template: EmailTemplateEnum.SignIn,
      variables: {
        [EmailTemplateEnum.SignIn]: { confirmLink, code, username },
      },
    });

    await this.emailAdapter.send({
      subject: template.subject,
      html: template.html,
      to: email,
    });
  }
}
