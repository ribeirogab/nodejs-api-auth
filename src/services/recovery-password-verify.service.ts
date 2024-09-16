import { inject, injectable } from 'tsyringe';

import { AppErrorCodeEnum, HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import {
  type RecoveryPasswordVerifyServiceDto,
  type RecoveryPasswordVerifyService as RecoveryPasswordVerifyServiceInterface,
  type VerificationCodeRepository,
  VerificationCodeTypeEnum,
} from '@/interfaces';

@injectable()
export class RecoveryPasswordVerifyService
  implements RecoveryPasswordVerifyServiceInterface
{
  constructor(
    @inject('VerificationCodeRepository')
    private readonly verificationCodeRepository: VerificationCodeRepository,
  ) {}

  public async execute({
    code,
  }: RecoveryPasswordVerifyServiceDto): Promise<void> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      type: VerificationCodeTypeEnum.RecoveryPassword,
      code,
    });

    if (!verificationCode) {
      throw new AppError({
        message: AppErrorCodeEnum.VerificationCodeNotFound,
        status_code: HttpStatusCodesEnum.NOT_FOUND,
      });
    }
  }
}
