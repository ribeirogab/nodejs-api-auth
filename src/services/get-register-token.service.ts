import { inject, injectable } from 'tsyringe';

import { AppErrorCodeEnum, HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import type {
  GetRegisterTokenServiceDto,
  GetRegisterTokenService as GetRegisterTokenServiceInterface,
  RegisterToken,
  RegisterTokenRepository,
} from '@/interfaces';

@injectable()
export class GetRegisterTokenService
  implements GetRegisterTokenServiceInterface
{
  constructor(
    @inject('RegisterTokenRepository')
    private readonly registerTokenRepository: RegisterTokenRepository,
  ) {}

  public async execute({
    token,
  }: GetRegisterTokenServiceDto): Promise<RegisterToken> {
    const registerToken = await this.registerTokenRepository.findById({
      id: token,
    });

    if (!registerToken) {
      throw new AppError({
        message: AppErrorCodeEnum.RegisterTokenNotFound,
        status_code: HttpStatusCodesEnum.NOT_FOUND,
      });
    }

    return registerToken;
  }
}
