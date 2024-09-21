import { globalCss } from '../global.css';
import { EmailTemplate, type EmailTemplateGetTemplateDto } from '../types';
import { en } from './en.template';
import { pt } from './pt.template';
import {
  EmailTemplateLangEnum,
  type EmailTemplateSignUpVariables,
} from '@/interfaces';

export class SignUpEmailTemplate
  implements EmailTemplate<EmailTemplateSignUpVariables>
{
  public readonly templatesByLang = {
    [EmailTemplateLangEnum.En]: en,
    [EmailTemplateLangEnum.Pt]: pt,
  };

  public getTemplate({
    organization,
    variables,
    lang,
  }: EmailTemplateGetTemplateDto<EmailTemplateSignUpVariables>): {
    subject: string;
    html: string;
  } {
    const { html, subject } = this.templatesByLang[lang]({
      ...variables,
      organization,
    });

    const htmlWithStyles = `
    <styles>
      ${globalCss}
    </styles>
    ${html}`;

    return { html: htmlWithStyles, subject };
  }
}
