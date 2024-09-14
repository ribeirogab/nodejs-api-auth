import type { EmailAdapter, EmailAdapterSendDto } from '@/interfaces';

export class ResendProvider implements EmailAdapter {
  public async send({
    subject,
    html,
    from,
    to,
  }: EmailAdapterSendDto): Promise<void> {
    console.log({ subject, html, from, to });
  }
}
