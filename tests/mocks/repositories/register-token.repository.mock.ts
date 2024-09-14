import type { Mocked } from 'vitest';

import type { RegisterTokenRepository } from '@/interfaces';

export class RegisterTokenRepositoryMock
  implements Mocked<RegisterTokenRepository>
{
  public create = vi.fn();
  public findById = vi.fn();
  public deleteById = vi.fn();
  public findByExternalId = vi.fn();
}
