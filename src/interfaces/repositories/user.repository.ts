import type { User } from '../models/user';

export interface UserRepository {
  create(user: Omit<User, 'id'>): Promise<void>;

  find(): Promise<User[]>;
}
