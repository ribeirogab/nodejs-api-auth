export enum LogLevelEnum {
  error = 0,
  warn = 1,
  info = 2,
  debug = 3,
}

export enum LogLevelKeyEnum {
  error = 'error',
  warn = 'warn',
  info = 'info',
  debug = 'debug',
}

export type LoggerMeta =
  | string
  | number
  | boolean
  | undefined
  | null
  | never
  | unknown;

export type LoggerAdapter = {
  error(message: string, ...meta: LoggerMeta[]): void;

  warn(message: string, ...meta: LoggerMeta[]): void;

  info(message: string, ...meta: LoggerMeta[]): void;

  debug(message: string, ...meta: LoggerMeta[]): void;

  setPrefix(logger: LoggerAdapter, prefix: string): LoggerAdapter;
};
