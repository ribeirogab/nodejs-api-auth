import { injectable } from 'tsyringe';

import type {
  User,
  UserRepository as UserRepositoryInterface,
} from '@/interfaces';

/** DynamoDB structure
 - PK: user
 - SK: id:{id}
 - Content: { name, email, password, id, created_at }
 - TTL: INT
 */

@injectable()
export class UserRepository implements UserRepositoryInterface {
  private readonly users: User[] = [];

  public async create(user: Omit<User, 'id'>): Promise<void> {
    this.users.push({
      ...user,
      id: String(this.users.length + 1),
    });
  }

  public async findByEmail(dto: { email: string }): Promise<User | null> {
    return this.users.find((user) => user.email === dto.email) || null;
  }
}
