import { inject, injectable } from 'tsyringe';

import type { EnvConfig } from '@/configs';
import {
  type CreateRegisterTokenServiceDto,
  type CreateRegisterTokenService as CreateRegisterTokenServiceInterface,
  type EmailAdapter,
  EmailTemplateEnum,
  type EmailTemplateRepository,
  type EmailTemplateRepositoryCompleteRegisterVariables,
  type RegisterTokenRepository,
  RegisterTokenTypeEnum,
  type UniqueIdAdapter,
} from '@/interfaces';

@injectable()
export class CreateRegisterTokenService
  implements CreateRegisterTokenServiceInterface
{
  constructor(
    @inject('RegisterTokenRepository')
    private readonly registerTokenRepository: RegisterTokenRepository,

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
  }: CreateRegisterTokenServiceDto): Promise<void> {
    const existentRegisterToken =
      await this.registerTokenRepository.findByExternalId({
        external_id: email,
      });

    if (existentRegisterToken) {
      await this.registerTokenRepository.deleteById({
        id: existentRegisterToken.id,
      });
    }

    const token = this.uniqueIdAdapter.generate();

    await this.registerTokenRepository.create({
      type: RegisterTokenTypeEnum.Email,
      external_id: email,
      id: token,
    });

    const completeRegisterUrl = `${this.envConfig.WEBSITE_BASE_URL}/complete-register/?token=${token}`;

    await this.emailAdapter.send({
      subject: 'Complete your register',
      to: email,
      html: this.emailTemplateRepository.getTemplate({
        template: EmailTemplateEnum.CompleteRegister,
        variables: {
          '{{COMPLETE_REGISTER_URL}}': completeRegisterUrl,
        } as EmailTemplateRepositoryCompleteRegisterVariables,
      }),
    });
  }
}
