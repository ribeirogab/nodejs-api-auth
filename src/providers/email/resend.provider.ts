import type { EmailProvider, EmailProviderSendDto } from '@/interfaces';

export class ResendProvider implements EmailProvider {
  public async send({
    subject,
    html,
    from,
    to,
  }: EmailProviderSendDto): Promise<void> {
    console.log({ subject, html, from, to });
  }
}
