import { injectable } from 'tsyringe';

import type {
  User,
  UserRepository as UserRepositoryInterface,
} from '@/interfaces';

@injectable()
export class UserRepository implements UserRepositoryInterface {
  private readonly users: User[] = [];

  public async create(user: Omit<User, 'id'>): Promise<void> {
    this.users.push({
      ...user,
      id: String(this.users.length + 1),
    });
  }

  public async find(): Promise<User[]> {
    return this.users;
  }
}
