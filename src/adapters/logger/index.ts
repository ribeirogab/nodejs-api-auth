import { inject, injectable } from 'tsyringe';

import { WinstonProvider } from './winston.provider';
import type { EnvConfig } from '@/configs';
import { LoggerProviderEnum } from '@/constants';
import type {
  LoggerAdapter as LoggerAdapterInterface,
  LoggerMeta,
} from '@/interfaces';

const providers = {
  [LoggerProviderEnum.Winston]: WinstonProvider,
};

@injectable()
export class LoggerAdapter implements LoggerAdapterInterface {
  private readonly provider: LoggerAdapterInterface;

  constructor(
    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {
    this.provider = new providers[this.envConfig.LOGGER_PROVIDER](
      this.envConfig,
    );
  }

  public info(message: string, ...meta: LoggerMeta[]): void {
    return this.provider.info(message, ...meta);
  }

  public error(message: string, ...meta: LoggerMeta[]): void {
    return this.provider.error(message, ...meta);
  }

  public debug(message: string, ...meta: LoggerMeta[]): void {
    return this.provider.debug(message, ...meta);
  }

  public setPrefix(
    logger: LoggerAdapterInterface,
    prefix: string,
  ): LoggerAdapterInterface {
    return this.provider.setPrefix(logger, prefix);
  }
}
