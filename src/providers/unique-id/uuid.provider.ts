import { v4 as uuidV4 } from 'uuid';

import { UniqueIdProvider } from '@/interfaces';

export class UuidProvider implements UniqueIdProvider {
  public generate(): string {
    return uuidV4();
  }
}
