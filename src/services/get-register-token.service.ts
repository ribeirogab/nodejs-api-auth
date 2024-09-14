import { inject, injectable } from 'tsyringe';

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
      throw new Error('Token not found or expired');
    }

    return registerToken;
  }
}
