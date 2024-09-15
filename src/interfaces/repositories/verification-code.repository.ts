import type { VerificationCode } from '../models/verification-code';

export interface VerificationCodeRepository {
  create(dto: Omit<VerificationCode, 'code'>): Promise<void>;

  findByCode(dto: { code: string }): Promise<VerificationCode | null>;

  findByContent(dto: { content: string }): Promise<VerificationCode | null>;

  deleteByCode(dto: { code: string }): Promise<void>;
}
