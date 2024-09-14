export type EmailProviderSendDto = {
  subject: string;
  from?: string;
  html: string;
  to: string;
};

export interface EmailProvider {
  send(dto: EmailProviderSendDto): Promise<void>;
}
