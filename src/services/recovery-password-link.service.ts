import { inject, injectable } from 'tsyringe';

import type { EnvConfig } from '@/configs';
import {
  type EmailAdapter,
  EmailTemplateEnum,
  type EmailTemplateRepository,
  type RecoveryPasswordLinkServiceDto,
  type RecoveryPasswordLinkService as RecoveryPasswordLinkServiceInterface,
  type UniqueIdAdapter,
  type UserRepository,
  type UserTokenRepository,
  UserTokenTypeEnum,
} from '@/interfaces';

@injectable()
export class RecoveryPasswordLinkService
  implements RecoveryPasswordLinkServiceInterface
{
  constructor(
    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('UserTokenRepository')
    private readonly userTokenRepository: UserTokenRepository,

    @inject('EmailTemplateRepository')
    private readonly emailTemplateRepository: EmailTemplateRepository,

    @inject('UniqueIdAdapter')
    private readonly uniqueIdAdapter: UniqueIdAdapter,

    @inject('EmailAdapter')
    private readonly emailAdapter: EmailAdapter,

    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {}

  public async execute({
    email,
  }: RecoveryPasswordLinkServiceDto): Promise<void> {
    const user = await this.userRepository.findByEmail({ email });

    if (!user?.email) {
      return;
    }

    const tokenExists = await this.userTokenRepository.findByUserId({
      user_id: user.id,
    });

    if (tokenExists) {
      await this.userTokenRepository.deleteById({ id: tokenExists.id });
    }

    const token = this.uniqueIdAdapter.generate();
    const expirationTimeInMinutes = 60;
    const expiresAt = new Date(
      Date.now() + expirationTimeInMinutes * 60 * 1000,
    ).toISOString();

    await this.userTokenRepository.create({
      type: UserTokenTypeEnum.RecoveryPassword,
      expires_at: expiresAt,
      user_id: user.id,
      id: token,
    });

    const resetPasswordUrl = `${this.envConfig.WEBSITE_BASE_URL}/forgot-password/reset-password/?token=${token}`;

    this.emailAdapter.send({
      subject: 'Recovery password',
      to: user.email,
      html: this.emailTemplateRepository.getTemplate({
        template: EmailTemplateEnum.RecoveryPassword,
        variables: {
          '{{RESET_PASSWORD_URL}}': resetPasswordUrl,
        },
      }),
    });
  }
}
