export { StatusCodes as HttpStatusCodesEnum } from 'http-status-codes';

export enum HttpMethodEnum {
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
}

export enum HttpCustomErrorCodeEnum {
  RegisterTokenNotFound = 'register_token_not_found',
}

export enum NodeEnvEnum {
  Development = 'development',
  Production = 'production',
}

export enum StageEnum {
  Prod = 'prod',
  Dev = 'dev',
}

export enum LogLevelsEnum {
  Debug = 'debug',
  Error = 'error',
  Info = 'info',
}
