import { DefaultTemplate } from '../default.template';
import { EmailTemplate, type EmailTemplateGetTemplateDto } from '../types';
import { en } from './en.template';
import { pt } from './pt.template';
import {
  EmailTemplateLangEnum,
  type EmailTemplateSignInVariables,
} from '@/interfaces';

export class SignInEmailTemplate
  extends DefaultTemplate
  implements EmailTemplate<EmailTemplateSignInVariables>
{
  public readonly templatesByLang = {
    [EmailTemplateLangEnum.En]: en,
    [EmailTemplateLangEnum.Pt]: pt,
  };

  public getTemplate({
    organization,
    variables,
    lang,
  }: EmailTemplateGetTemplateDto<EmailTemplateSignInVariables>): {
    subject: string;
    html: string;
  } {
    const { html, subject } = this.templatesByLang[lang]({
      ...variables,
      organization,
    });

    const htmlWithStyles = this.addGlobalStyles(html);

    return { html: htmlWithStyles, subject };
  }
}
