import type { User } from '../models/user';

export interface UserRepository {
  create(user: Omit<User, 'id'>): Promise<User>;

  findByEmail(dto: { email: string }): Promise<User | null>;

  updateByEmail(dto: {
    email: string;
    update: Partial<Omit<User, 'id' | 'email' | 'created_at'>>;
  }): Promise<User>;
}
