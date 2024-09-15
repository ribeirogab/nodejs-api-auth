import * as winston from 'winston';

import type { EnvConfig } from '@/configs';
import { LogLevelsEnum, NodeEnvEnum } from '@/constants';
import type { LoggerAdapter } from '@/interfaces';

export class WinstonProvider implements LoggerAdapter {
  private readonly levels = Object.values(LogLevelsEnum);
  private readonly logger: winston.Logger;

  constructor(private readonly envConfig: EnvConfig) {
    this.logger = winston.createLogger({
      format: winston.format.combine(winston.format.json()),
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
      ],
      level: this.envConfig.LOG_LEVEL,
      exitOnError: false,
    });

    if (this.envConfig.NODE_ENV !== NodeEnvEnum.Production) {
      this.logger.format = winston.format.combine(
        winston.format.json(),
        winston.format.colorize({ level: true, message: true }),
      );

      this.logger.level = LogLevelsEnum.Debug;
    }
  }

  public info(message: string, ...meta: never[]): void {
    this.logger.info(message, ...(meta || []));
  }

  public error(message: string, ...meta: never[]): void {
    this.logger.error(message, ...(meta || []));
  }

  public debug(message: string, ...meta: never[]): void {
    this.logger.debug(message, ...(meta || []));
  }

  public setPrefix(logger: LoggerAdapter, prefix: string): LoggerAdapter {
    const newLoggerInstance = { ...logger };

    this.levels.forEach((level) => {
      newLoggerInstance[level] = (message: string, ...meta: never[]) =>
        this.logger[level](`${prefix} | ${message}`, ...(meta || []));
    });

    return newLoggerInstance;
  }
}
