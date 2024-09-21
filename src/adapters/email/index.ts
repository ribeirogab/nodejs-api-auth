import { inject, injectable } from 'tsyringe';

import { ResendProvider } from './resend.provider';
import type { EnvConfig } from '@/configs';
import { EmailProviderEnum } from '@/constants';
import {
  EmailAdapter as EmailAdapterInterface,
  EmailAdapterSendDto,
  type LoggerAdapter,
} from '@/interfaces';

const providers = {
  [EmailProviderEnum.Resend]: ResendProvider,
};

@injectable()
export class EmailAdapter implements EmailAdapterInterface {
  private readonly provider: EmailAdapterInterface;

  constructor(
    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,

    @inject('LoggerAdapter')
    private readonly logger: LoggerAdapter,
  ) {
    this.provider = new providers[this.envConfig.EMAIL_PROVIDER](
      this.envConfig,
      this.logger,
    );
  }

  public async send(dto: EmailAdapterSendDto): Promise<void> {
    return this.provider.send(dto);
  }
}
