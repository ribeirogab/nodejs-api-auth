import { inject, injectable } from 'tsyringe';

import type {
  UniqueIdAdapter,
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

  constructor(
    @inject('UniqueIdAdapter')
    private readonly uniqueIdAdapter: UniqueIdAdapter,
  ) {}

  public async create(user: Omit<User, 'id'>): Promise<void> {
    this.users.push({
      id: this.uniqueIdAdapter.generate(),
      ...user,
    });
  }

  public async findByEmail(dto: { email: string }): Promise<User | null> {
    return this.users.find((user) => user.email === dto.email) || null;
  }
}
