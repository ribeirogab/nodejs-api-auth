import { inject, injectable } from 'tsyringe';

import type {
  LoggerAdapter,
  VerificationCode,
  VerificationCodeRepositoryFilterDto,
  VerificationCodeRepository as VerificationCodeRepositoryInterface,
} from '@/interfaces';

/** DynamoDB structure
 - PK: verification-code
 - SK: code:{code}::type:{type}
 - Content: { code, type, content, expires_at }
 - TTL: INT
 */

@injectable()
export class VerificationCodeRepository
  implements VerificationCodeRepositoryInterface
{
  private codes: VerificationCode[] = [];

  constructor(@inject('LoggerAdapter') private readonly logger: LoggerAdapter) {
    this.logger.setPrefix(this.logger, VerificationCodeRepository.name);
  }

  public async create(dto: Omit<VerificationCode, 'code'>): Promise<void> {
    const code = this.generateCode(6);

    const verificationCode = { ...dto, code };

    this.codes.push(verificationCode);

    this.logger.debug('Verification code created:', verificationCode);
  }

  public async findOne({
    code,
    type,
  }: VerificationCodeRepositoryFilterDto): Promise<VerificationCode | null> {
    const verificationCode = this.codes.find(
      (registerCode) =>
        registerCode.code === code && registerCode.type === type,
    );

    return verificationCode || null;
  }

  public async findOneByContent({
    content,
  }: {
    content: { key: string; value: string };
  }): Promise<VerificationCode | null> {
    const verificationCode = this.codes.find(
      (registerCode) => registerCode.content[content.key] === content.value,
    );

    return verificationCode || null;
  }

  public async deleteOne({
    code,
    type,
  }: VerificationCodeRepositoryFilterDto): Promise<void> {
    this.codes = this.codes.filter(
      (verificationCode) =>
        verificationCode.code !== code && verificationCode.type !== type,
    );
  }

  private generateCode(length: number): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }
}
