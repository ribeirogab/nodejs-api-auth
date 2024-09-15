import type {
  UserToken,
  UserTokenRepository as UserTokenRepositoryInterface,
} from '@/interfaces';

/** DynamoDB structure
 - PK: user-token
 - SK: id:{id}::user_id:{user_id}::type:{type}
 - Content: { id, type, user_id, expires_at }
 - TTL: INT
 */

export class UserTokenRepository implements UserTokenRepositoryInterface {
  private tokens: UserToken[] = [];

  public async create(dto: UserToken): Promise<void> {
    this.tokens.push(dto);
  }

  public async findById(dto: { id: string }): Promise<UserToken | null> {
    const token = this.tokens.find(
      (registerToken) => registerToken.id === dto.id,
    );

    return token || null;
  }

  public async deleteById(dto: { id: string }): Promise<void> {
    this.tokens = this.tokens.filter((token) => token.id !== dto.id);
  }

  public async findByUserId(dto: {
    user_id: string;
  }): Promise<UserToken | null> {
    const token = this.tokens.find(
      (registerToken) => registerToken.user_id === dto.user_id,
    );

    return token || null;
  }
}
