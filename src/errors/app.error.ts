import { AppErrorCodeEnum, type HttpStatusCodesEnum } from '@/constants';

export type AppErrorConstructor = {
  status_code: HttpStatusCodesEnum;
  error_code?: AppErrorCodeEnum;
  details?: unknown;
  message: string;
};

export class AppError extends Error {
  public readonly status_code: HttpStatusCodesEnum;
  public readonly error_code?: AppErrorCodeEnum;
  public readonly details?: unknown;

  constructor({
    error_code = AppErrorCodeEnum.Unknown,
    status_code,
    message,
    details,
  }: AppErrorConstructor) {
    super(message);
    this.status_code = status_code;
    this.error_code = error_code;
    this.details = details;
  }
}
