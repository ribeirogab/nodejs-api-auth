import type { RegisterToken } from '@/interfaces';
import type { RegisterTokenRepository as RegisterTokenRepositoryInterface } from '@/interfaces/repositories/register-token.repository';

/** DynamoDB structure
 - PK: register-token
 - SK: id:{id}::external_id:{external_id}::type:{type}
 - Content: { email, token, type, external_id }
 - TTL: INT
 */

export class RegisterTokenRepository
  implements RegisterTokenRepositoryInterface
{
  private tokens: RegisterToken[] = [];

  async create(dto: RegisterToken): Promise<void> {
    this.tokens.push({ ...dto, id: String(this.tokens.length + 1) });
  }

  async findById(dto: { id: string }): Promise<RegisterToken | null> {
    const token = this.tokens.find(
      (registerToken) => registerToken.id === dto.id,
    );

    return token || null;
  }

  async deleteById(dto: { id: string }): Promise<void> {
    this.tokens = this.tokens.filter((token) => token.id !== dto.id);
  }

  async findByExternalId(dto: {
    external_id: string;
  }): Promise<RegisterToken | null> {
    const token = this.tokens.find(
      (registerToken) => registerToken.external_id === dto.external_id,
    );

    return token || null;
  }
}
