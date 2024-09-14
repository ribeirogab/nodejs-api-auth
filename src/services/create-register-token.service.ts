import { inject, injectable } from 'tsyringe';

import {
  type CreateRegisterTokenServiceDto,
  type CreateRegisterTokenService as CreateRegisterTokenServiceInterface,
  type RegisterTokenRepository,
  RegisterTokenTypeEnum,
} from '@/interfaces';

@injectable()
export class CreateRegisterTokenService
  implements CreateRegisterTokenServiceInterface
{
  constructor(
    @inject('RegisterTokenRepository')
    private readonly registerTokenRepository: RegisterTokenRepository,
  ) {}

  public async execute({
    email,
  }: CreateRegisterTokenServiceDto): Promise<void> {
    const existentRegisterToken =
      await this.registerTokenRepository.findByExternalId({
        external_id: email,
      });

    if (existentRegisterToken) {
      await this.registerTokenRepository.deleteById({
        id: existentRegisterToken.id,
      });
    }

    await this.registerTokenRepository.create({
      type: RegisterTokenTypeEnum.Email,
      external_id: email,
    });
  }
}
