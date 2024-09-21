export { StatusCodes as HttpStatusCodesEnum } from 'http-status-codes';

export enum HttpMethodEnum {
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
}

export enum AppErrorCodeEnum {
  VerificationCodeInvalidOrExpired = 'verification_code_invalid_or_expired',
  RegisterTokenNotFound = 'register_token_not_found',
  EmailAlreadyInUse = 'email_already_in_use',
  ValidationError = 'validation_error',
  InvalidLogin = 'invalid_login',
  Unknown = 'unknown',
}

export enum NodeEnvEnum {
  Development = 'development',
  Production = 'production',
}

export enum StageEnum {
  Prod = 'prod',
  Dev = 'dev',
}

export enum EmailProviderEnum {
  Resend = 'resend',
}

export enum UniqueIdProviderEnum {
  Uuid = 'uuid',
}

export enum LoggerProviderEnum {
  Winston = 'winston',
}
