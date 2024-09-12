export type LoggerMeta =
  | string
  | number
  | boolean
  | undefined
  | null
  | never
  | unknown;

export type LoggerConfig = {
  info(message: string, ...meta: LoggerMeta[]): void;

  error(message: string, ...meta: LoggerMeta[]): void;

  debug(message: string, ...meta: LoggerMeta[]): void;

  setPrefix(logger: LoggerConfig, prefix: string): LoggerConfig;
};
