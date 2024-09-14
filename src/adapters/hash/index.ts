import { inject, injectable } from 'tsyringe';

import { CryptoProvider } from './crypto.provider';
import { HashProviderEnum } from '@/constants';
import type {
  EnvConfig,
  HashAdapterCompareDto,
  HashAdapterHashDto,
  HashAdapter as HashAdapterInterface,
} from '@/interfaces';

const providers = {
  [HashProviderEnum.Crypto]: CryptoProvider,
};

@injectable()
export class HashAdapter implements HashAdapterInterface {
  private readonly provider: HashAdapterInterface;

  constructor(
    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {
    this.provider = new providers[this.envConfig.HASH_PROVIDER]();
  }

  public generateSalt(length?: number): string {
    return this.provider.generateSalt(length);
  }

  public hash(dto: HashAdapterHashDto): string {
    return this.provider.hash(dto);
  }

  public compare(dto: HashAdapterCompareDto): boolean {
    return this.provider.compare(dto);
  }
}
