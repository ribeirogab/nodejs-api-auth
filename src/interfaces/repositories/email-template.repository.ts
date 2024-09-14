export enum EmailTemplateEnum {
  CompleteRegister = 'complete-register',
}

export type EmailTemplateRepositoryCompleteRegisterVariables = {
  '{{COMPLETE_REGISTER_URL}}': string;
};

export type EmailTemplateRepositoryGetTemplateDto = {
  variables: EmailTemplateRepositoryCompleteRegisterVariables;
  template: EmailTemplateEnum;
  lang?: string;
};

export interface EmailTemplateRepository {
  getTemplate(dto: EmailTemplateRepositoryGetTemplateDto): string;
}
