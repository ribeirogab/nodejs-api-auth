import type { Mocked } from 'vitest';

import type { UserRepository } from '@/interfaces';

export class UserRepositoryMock implements Mocked<UserRepository> {
  public create = vi.fn();
  public findByEmail = vi.fn();
}
