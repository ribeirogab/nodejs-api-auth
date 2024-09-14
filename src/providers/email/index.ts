import { inject, injectable } from 'tsyringe';

import { ResendProvider } from './resend.provider';
import { EmailProviderEnum } from '@/constants';
import {
  EmailProvider as EmailProviderInterface,
  EmailProviderSendDto,
  EnvConfig,
} from '@/interfaces';

const providers = {
  [EmailProviderEnum.Resend]: ResendProvider,
};

@injectable()
export class EmailProvider implements EmailProviderInterface {
  private readonly provider: EmailProviderInterface;

  constructor(
    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {
    this.provider = new providers[this.envConfig.EMAIL_PROVIDER]();
  }

  public async send(dto: EmailProviderSendDto): Promise<void> {
    return this.provider.send(dto);
  }
}
