export enum EmailTemplateEnum {
  CompleteRegister = 'complete-register',
  RecoveryPassword = 'recovery-password',
}

export type EmailTemplateRepositoryCompleteRegisterVariables = {
  '{{COMPLETE_REGISTER_URL}}': string;
};

export type EmailTemplateRepositoryRecoveryPasswordVariables = {
  '{{RESET_PASSWORD_URL}}': string;
};

export type EmailTemplateRepositoryGetTemplateDto = {
  variables:
    | EmailTemplateRepositoryCompleteRegisterVariables
    | EmailTemplateRepositoryRecoveryPasswordVariables;
  template: EmailTemplateEnum;
  lang?: string;
};

export interface EmailTemplateRepository {
  getTemplate(dto: EmailTemplateRepositoryGetTemplateDto): string;
}
