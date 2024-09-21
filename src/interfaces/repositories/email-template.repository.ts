export enum EmailTemplateEnum {
  SignIn = 'sign-in',
  SignUp = 'sign-up',
}

export enum EmailTemplateLangEnum {
  En = 'en',
  Pt = 'pt',
}

export type EmailTemplateSignInVariables = {
  confirmLink: string;
  username: string;
  code: string;
};

export type EmailTemplateSignUpVariables = {
  confirmLink: string;
  code: string;
};

export type EmailTemplateRepositoryGetTemplateDto = {
  lang?: EmailTemplateLangEnum;
  template: EmailTemplateEnum;
  variables: {
    [EmailTemplateEnum.SignIn]?: EmailTemplateSignInVariables;
    [EmailTemplateEnum.SignUp]?: EmailTemplateSignUpVariables;
  };
};

export interface EmailTemplateRepository {
  getTemplate(dto: EmailTemplateRepositoryGetTemplateDto): {
    subject: string;
    html: string;
  };
}
