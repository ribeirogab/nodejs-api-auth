import * as winston from 'winston';

import type { EnvConfig } from '@/configs';
import { NodeEnvEnum } from '@/constants';
import {
  LogLevelEnum,
  LogLevelKeyEnum,
  type LoggerAdapter,
} from '@/interfaces';

export class WinstonProvider implements LoggerAdapter {
  private readonly levels = Object.keys(LogLevelEnum)
    .filter((enumKey) => isNaN(Number(enumKey)))
    .reduce(
      (levels, enumKey) => ({
        ...levels,
        [enumKey]: LogLevelEnum[enumKey as keyof typeof LogLevelEnum],
      }),
      {} as Record<string, number>,
    );

  private readonly levelKeys = Object.values(LogLevelKeyEnum);

  private readonly logger: winston.Logger;

  constructor(private readonly envConfig: EnvConfig) {
    this.logger = winston.createLogger({
      format: winston.format.combine(winston.format.json()),
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
      ],
      level: this.envConfig.LOG_LEVEL,
      levels: this.levels,
      exitOnError: false,
    });

    if (this.envConfig.NODE_ENV !== NodeEnvEnum.Production) {
      this.logger.format = winston.format.combine(
        winston.format.json(),
        winston.format.colorize({ level: true, message: true }),
      );
    }
  }

  public error(message: string, ...meta: never[]): void {
    this.logger.error(message, ...(meta || []));
  }

  public warn(message: string, ...meta: never[]): void {
    this.logger.warn(message, ...(meta || []));
  }

  public info(message: string, ...meta: never[]): void {
    this.logger.info(message, ...(meta || []));
  }

  public debug(message: string, ...meta: never[]): void {
    this.logger.debug(message, ...(meta || []));
  }

  public setPrefix(logger: LoggerAdapter, prefix: string): LoggerAdapter {
    const newLoggerInstance = { ...logger };

    this.levelKeys.forEach((level) => {
      newLoggerInstance[level] = (message: string, ...meta: never[]) =>
        this.logger[level](`${prefix} | ${message}`, ...(meta || []));
    });

    return newLoggerInstance;
  }
}
