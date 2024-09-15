import type {
  VerificationCode,
  VerificationCodeRepository as VerificationCodeRepositoryInterface,
} from '@/interfaces';

/** DynamoDB structure
 - PK: verification-code
 - SK: code:{code}::type:{type}
 - Content: { code, type, content, expires_at }
 - TTL: INT
 */

export class VerificationCodeRepository
  implements VerificationCodeRepositoryInterface
{
  private codes: VerificationCode[] = [];

  public async create(dto: Omit<VerificationCode, 'code'>): Promise<void> {
    const code = this.generateCode(6);
    this.codes.push({ ...dto, code });
  }

  public async findByCode(dto: {
    code: string;
  }): Promise<VerificationCode | null> {
    const code = this.codes.find(
      (registerCode) => registerCode.code === dto.code,
    );

    return code || null;
  }

  public async findByContent(dto: {
    content: string;
  }): Promise<VerificationCode | null> {
    const code = this.codes.find(
      (registerCode) => registerCode.content === dto.content,
    );

    return code || null;
  }

  public async deleteByCode(dto: { code: string }): Promise<void> {
    this.codes = this.codes.filter((code) => code.code !== dto.code);
  }

  private generateCode(length: number): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }
}
