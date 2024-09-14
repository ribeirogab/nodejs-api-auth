import type { Mocked } from 'vitest';

import type { HashAdapter } from '@/interfaces';

export class HashAdapterMock implements Mocked<HashAdapter> {
  public generateSalt = vi.fn();
  public hash = vi.fn();
  public compare = vi.fn();
}
