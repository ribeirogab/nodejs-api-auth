import { inject, injectable } from 'tsyringe';

import { UuidProvider } from './uuid.provider';
import { UniqueIdProviderEnum } from '@/constants';
import {
  type EnvConfig,
  UniqueIdProvider as UniqueIdProviderInterface,
} from '@/interfaces';

const providers = {
  [UniqueIdProviderEnum.Uuid]: UuidProvider,
};

@injectable()
export class UniqueIdProvider implements UniqueIdProviderInterface {
  private readonly provider: UniqueIdProviderInterface;

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
