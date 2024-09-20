export enum VerificationCodeTypeEnum {
  RecoveryPassword = 'recovery-password',
  Registration = 'registration',
}

export enum VerificationCodeReservedFieldEnum {
  code_expires_at = 'code_expires_at',
  code_type = 'code_type',
  code = 'code',
}

export type VerificationCode = {
  code_type: VerificationCodeTypeEnum;
  code_expires_at: string;
  code: string;
};
