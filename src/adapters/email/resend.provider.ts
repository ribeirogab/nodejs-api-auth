import { Resend } from 'resend';

import type { EnvConfig } from '@/configs';
import type {
  EmailAdapter,
  EmailAdapterSendDto,
  LoggerAdapter,
} from '@/interfaces';

export class ResendProvider implements EmailAdapter {
  private readonly client: Resend;

  constructor(
    private readonly envConfig: EnvConfig,
    private readonly logger: LoggerAdapter,
  ) {
    this.client = new Resend(this.envConfig.RESEND_API_KEY);
    this.logger = this.logger.setPrefix(this.logger, ResendProvider.name);
  }

  public async send({
    from = this.envConfig.DEFAULT_SENDER_EMAIL,
    subject,
    html,
    to,
  }: EmailAdapterSendDto): Promise<void> {
    this.logger.debug('Sending email...', { subject, from, to });

    const { data, error } = await this.client.emails.send({
      subject,
      from,
      html,
      to,
    });

    if (data) {
      this.logger.debug('Email sent', { data });
    }

    if (error) {
      this.logger.error('Email not sent', { error });
    }
  }
}
