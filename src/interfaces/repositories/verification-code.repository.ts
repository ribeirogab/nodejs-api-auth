import type {
  VerificationCode,
  VerificationCodeTypeEnum,
} from '../models/verification-code';

export type VerificationCodeRepositoryFilterDto = {
  type: VerificationCodeTypeEnum;
  code: string;
};

export type VerificationCodeRepositoryFindOneByContentDto = {
  content: { key: string; value: string };
  type: VerificationCodeTypeEnum;
};

export interface VerificationCodeRepository {
  create(dto: Omit<VerificationCode, 'code'>): Promise<VerificationCode>;

  findOne(
    dto: VerificationCodeRepositoryFilterDto,
  ): Promise<VerificationCode | null>;

  deleteOne(dto: VerificationCodeRepositoryFilterDto): Promise<void>;

  findOneByContent(
    dto: VerificationCodeRepositoryFindOneByContentDto,
  ): Promise<VerificationCode | null>;
}
