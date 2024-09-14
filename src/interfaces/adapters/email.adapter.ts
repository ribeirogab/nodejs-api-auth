export type EmailAdapterSendDto = {
  subject: string;
  from?: string;
  html: string;
  to: string;
};

export interface EmailAdapter {
  send(dto: EmailAdapterSendDto): Promise<void>;
}
