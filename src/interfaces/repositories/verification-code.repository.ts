import type {
  VerificationCode,
  VerificationCodeTypeEnum,
} from '../models/verification-code';

export type VerificationCodeRepositoryFilterDto = {
  code_type: VerificationCodeTypeEnum;
  code: string;
};

export type VerificationCodeRepositoryCreateDto = Omit<
  VerificationCode,
  'code'
> & {
  content: Record<string, string | number>;
};

export type VerificationCodeRepositoryFindOneByContentDto = {
  content: { key: string; value: string };
  code_type: VerificationCodeTypeEnum;
};

export interface VerificationCodeRepository {
  create(dto: VerificationCodeRepositoryCreateDto): Promise<VerificationCode>;

  findOne(
    dto: VerificationCodeRepositoryFilterDto,
  ): Promise<VerificationCode | null>;

  deleteOne(dto: VerificationCodeRepositoryFilterDto): Promise<void>;

  findOneByContent(
    dto: VerificationCodeRepositoryFindOneByContentDto,
  ): Promise<VerificationCode | null>;

  removeReservedFields<T>(dto: VerificationCode): T;
}
