import { v4 as uuidV4 } from 'uuid';

import { UniqueIdAdapter } from '@/interfaces';

export class UuidProvider implements UniqueIdAdapter {
  public generate(): string {
    return uuidV4();
  }
}
