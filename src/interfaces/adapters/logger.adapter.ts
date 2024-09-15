export type LoggerMeta =
  | string
  | number
  | boolean
  | undefined
  | null
  | never
  | unknown;

export type LoggerAdapter = {
  info(message: string, ...meta: LoggerMeta[]): void;

  error(message: string, ...meta: LoggerMeta[]): void;

  debug(message: string, ...meta: LoggerMeta[]): void;

  setPrefix(logger: LoggerAdapter, prefix: string): LoggerAdapter;
};
