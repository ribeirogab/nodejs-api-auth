import type { RegisterToken } from '../models/register-token';

export interface RegisterTokenRepository {
  create(dto: RegisterToken): Promise<void>;

  findById(dto: { id: string }): Promise<RegisterToken | null>;

  deleteById(dto: { id: string }): Promise<void>;

  findByExternalId(dto: { external_id: string }): Promise<RegisterToken | null>;
}
