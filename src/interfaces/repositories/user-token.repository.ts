import type { UserToken } from '../models/user-token';

export interface UserTokenRepository {
  create(dto: UserToken): Promise<void>;

  findById(dto: { id: string }): Promise<UserToken | null>;

  deleteById(dto: { id: string }): Promise<void>;

  findByUserId(dto: { user_id: string }): Promise<UserToken | null>;
}
