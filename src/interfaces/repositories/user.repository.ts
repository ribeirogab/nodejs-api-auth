import type { User } from '../models/user';

export interface UserRepository {
  create(user: Omit<User, 'id'>): Promise<User>;

  findOne(dto: { id: string }): Promise<User | null>;
}
