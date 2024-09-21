import type {
  EmailTemplateLangEnum,
  EmailTemplateSignInVariables,
  EmailTemplateSignUpVariables,
} from '@/interfaces';

export interface EmailTemplateGetTemplateDto<Variables> {
  organization?: { name?: string; logoUrl?: string };
  lang: EmailTemplateLangEnum;
  variables: Variables;
}

export interface EmailTemplate<Variables> {
  getTemplate(dto: EmailTemplateGetTemplateDto<Variables>): {
    subject: string;
    html: string;
  };
}

export type SignUpEmailTemplateLang = (
  dto: EmailTemplateSignUpVariables & {
    organization?: {
      logoUrl?: string;
      name?: string;
    };
  },
) => {
  subject: string;
  html: string;
};

export type SignInEmailTemplateLang = (
  dto: EmailTemplateSignInVariables & {
    organization?: {
      logoUrl?: string;
      name?: string;
    };
  },
) => {
  subject: string;
  html: string;
};
