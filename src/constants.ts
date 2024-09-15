export { StatusCodes as HttpStatusCodesEnum } from 'http-status-codes';

export enum HttpMethodEnum {
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
}

export enum AppErrorCodeEnum {
  RegisterTokenNotFound = 'register_token_not_found',
  EmailAlreadyInUse = 'email_already_in_use',
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

export enum HashProviderEnum {
  Crypto = 'crypto',
}

export enum LoggerProviderEnum {
  Winston = 'winston',
}
