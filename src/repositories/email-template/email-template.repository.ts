import { inject, injectable } from 'tsyringe';

import { templates } from './templates';
import {
  EmailTemplateLangEnum,
  type EmailTemplateRepositoryGetTemplateDto,
  EmailTemplateRepository as EmailTemplateRepositoryInterface,
  type LoggerAdapter,
} from '@/interfaces';

@injectable()
export class EmailTemplateRepository
  implements EmailTemplateRepositoryInterface
{
  private readonly organization?: {
    logoUrl?: string;
    name?: string;
  };

  constructor(
    @inject('LoggerAdapter') private readonly logger: LoggerAdapter,
  ) {}

  public getTemplate({
    lang = EmailTemplateLangEnum.En,
    variables,
    template,
  }: EmailTemplateRepositoryGetTemplateDto): { html: string; subject: string } {
    const templateVariables = variables[template];

    if (!templateVariables) {
      throw new Error('Template variables not found');
    }

    if (!templates[template]) {
      throw new Error('Template not found');
    }

    const { html, subject } = templates[template].getTemplate({
      variables: templateVariables as never,
      organization: this.organization,
      lang,
    });

    this.logger.debug('Email template retrieved', {
      template,
      subject,
      lang,
      html,
    });

    return { html, subject };
  }
}
