import fs from 'node:fs';
import path from 'node:path';

import { injectable } from 'tsyringe';

import { emailTemplatesDirname } from '@/adapters/email/templates';
import {
  EmailTemplateEnum,
  type EmailTemplateRepositoryGetTemplateDto,
  EmailTemplateRepository as EmailTemplateRepositoryInterface,
} from '@/interfaces';

@injectable()
export class EmailTemplateRepository
  implements EmailTemplateRepositoryInterface
{
  public getTemplate({
    variables,
    template,
    lang = 'pt-br',
  }: EmailTemplateRepositoryGetTemplateDto): string {
    const templateString = this.getTemplateFileString({
      template,
      lang,
    });

    if (!templateString) {
      throw new Error('Template not found');
    }

    return this.replaceVariables({ variables, templateString });
  }

  private getTemplateFileString({
    lang = 'pt-br',
    template,
  }: {
    template: EmailTemplateEnum;
    lang?: string;
  }) {
    const filePath = path.resolve(
      emailTemplatesDirname,
      template,
      `${lang}.template.html`,
    );

    const emailTemplate = fs.readFileSync(filePath, 'utf-8');

    return emailTemplate || null;
  }

  private replaceVariables({
    templateString,
    variables,
  }: {
    variables: Record<string, string>;
    templateString: string;
  }) {
    Object.keys(variables).forEach((variable) => {
      templateString = templateString.replace(
        new RegExp(variable, 'g'),
        variables[variable],
      );
    });

    return templateString;
  }
}
