import { inject, injectable } from 'tsyringe';

import type {
  LoggerAdapter,
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

    @inject('LoggerAdapter')
    private readonly logger: LoggerAdapter,
  ) {}

  public async create(dto: Omit<User, 'id'>): Promise<User> {
    const user = {
      id: this.uniqueIdAdapter.generate(),
      ...dto,
    };

    this.users.push(user);

    this.logger.debug('User created:', user);

    return user;
  }

  public async findByEmail(dto: { email: string }): Promise<User | null> {
    return this.users.find((user) => user.email === dto.email) || null;
  }

  public async updateByEmail({
    update,
    email,
  }: {
    update: Partial<Omit<User, 'id' | 'email' | 'created_at'>>;
    email: string;
  }): Promise<void> {
    const user = this.users.find((model) => model.email === email);

    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      ...update,
    };

    this.users.splice(this.users.indexOf(user), 1, updatedUser);

    this.logger.debug('User updated:', updatedUser);
  }
}
