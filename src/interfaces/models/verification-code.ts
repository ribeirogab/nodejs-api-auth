export enum VerificationCodeTypeEnum {
  Registration = 'registration',
  Login = 'login',
}

export enum VerificationCodeReservedFieldEnum {
  code_expires_at = 'code_expires_at',
  code_type = 'code_type',
  token = 'token',
  code = 'code',
}

export type VerificationCode = {
  code_type: VerificationCodeTypeEnum;
  code_expires_at: string;
  token: string;
  code: string;
};
