import type { User } from '../models/user';

export interface UserRepository {
  create(user: Omit<User, 'id'>): Promise<void>;

  findByEmail(dto: { email: string }): Promise<User | null>;
}
