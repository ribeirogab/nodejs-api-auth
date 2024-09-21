import { SignInEmailTemplate } from './sign-in';
import { SignUpEmailTemplate } from './sign-up';
import { EmailTemplateEnum } from '@/interfaces';

export const templates = {
  [EmailTemplateEnum.SignUp]: new SignUpEmailTemplate(),
  [EmailTemplateEnum.SignIn]: new SignInEmailTemplate(),
};
