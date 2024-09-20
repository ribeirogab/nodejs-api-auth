export enum VerificationCodeTypeEnum {
  RecoveryPassword = 'recovery-password',
  Registration = 'registration',
}

export type VerificationCode = {
  data: Record<string, string | number>;
  type: VerificationCodeTypeEnum;
  expires_at: string;
  code: string;
};
