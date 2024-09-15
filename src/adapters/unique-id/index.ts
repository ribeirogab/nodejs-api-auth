import { inject, injectable } from 'tsyringe';

import { UuidProvider } from './uuid.provider';
import type { EnvConfig } from '@/configs';
import { UniqueIdProviderEnum } from '@/constants';
import type { UniqueIdAdapter as UniqueIdAdapterInterface } from '@/interfaces';

const providers = {
  [UniqueIdProviderEnum.Uuid]: UuidProvider,
};

@injectable()
export class UniqueIdAdapter implements UniqueIdAdapterInterface {
  private readonly provider: UniqueIdAdapterInterface;

  constructor(
    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {
    this.provider = new providers[this.envConfig.UNIQUE_ID_PROVIDER]();
  }

  public generate(): string {
    return this.provider.generate();
  }
}
