import type { HttpStatusCodesEnum } from '@/constants';

export type AppErrorConstructor = {
  status_code: HttpStatusCodesEnum;
  details?: unknown;
  message: string;
};

export class AppError extends Error {
  public readonly status_code: HttpStatusCodesEnum;
  public readonly details?: unknown;

  constructor({ message, status_code, details }: AppErrorConstructor) {
    super(message);
    this.status_code = status_code;
    this.details = details;
  }
}
