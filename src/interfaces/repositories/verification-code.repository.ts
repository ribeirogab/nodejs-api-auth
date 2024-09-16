import type {
  VerificationCode,
  VerificationCodeTypeEnum,
} from '../models/verification-code';

export type VerificationCodeRepositoryFilterDto = {
  type: VerificationCodeTypeEnum;
  code: string;
};

export interface VerificationCodeRepository {
  create(dto: Omit<VerificationCode, 'code'>): Promise<void>;

  findOne(
    dto: VerificationCodeRepositoryFilterDto,
  ): Promise<VerificationCode | null>;

  deleteOne(dto: VerificationCodeRepositoryFilterDto): Promise<void>;

  findOneByContent(dto: {
    content: { key: string; value: string };
  }): Promise<VerificationCode | null>;
}
