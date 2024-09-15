import type {
  RegisterToken,
  RegisterTokenRepository as RegisterTokenRepositoryInterface,
} from '@/interfaces';

/** DynamoDB structure
 - PK: register-token
 - SK: id:{id}::type:{type}::external_id:{external_id}
 - Content: { id, type, external_id }
 - TTL: INT
 */

export class RegisterTokenRepository
  implements RegisterTokenRepositoryInterface
{
  private tokens: RegisterToken[] = [];

  public async create(dto: RegisterToken): Promise<void> {
    this.tokens.push(dto);
  }

  public async findById(dto: { id: string }): Promise<RegisterToken | null> {
    const token = this.tokens.find(
      (registerToken) => registerToken.id === dto.id,
    );

    return token || null;
  }

  public async deleteById(dto: { id: string }): Promise<void> {
    this.tokens = this.tokens.filter((token) => token.id !== dto.id);
  }

  public async findByExternalId(dto: {
    external_id: string;
  }): Promise<RegisterToken | null> {
    const token = this.tokens.find(
      (registerToken) => registerToken.external_id === dto.external_id,
    );

    return token || null;
  }

  // Temporary method to get all tokens
  public find(): RegisterToken[] {
    return this.tokens;
  }
}
