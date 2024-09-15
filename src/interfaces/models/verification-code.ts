export enum VerificationCodeTypeEnum {
  RecoveryPassword = 'recovery-password',
  Registration = 'registration',
}

export type VerificationCode = {
  type: VerificationCodeTypeEnum;
  expires_at: string;
  content: string;
  code: string;
};
