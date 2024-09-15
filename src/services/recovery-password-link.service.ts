import { inject, injectable } from 'tsyringe';

import type { EnvConfig } from '@/configs';
import type {
  EmailAdapter,
  EmailTemplateRepository,
  RecoveryPasswordLinkServiceDto,
  RecoveryPasswordLinkService as RecoveryPasswordLinkServiceInterface,
  UniqueIdAdapter,
  UserRepository,
} from '@/interfaces';

@injectable()
export class RecoveryPasswordLinkService
  implements RecoveryPasswordLinkServiceInterface
{
  constructor(
    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('EmailTemplateRepository')
    private readonly emailTemplateRepository: EmailTemplateRepository,

    @inject('UniqueIdAdapter')
    private readonly uniqueIdAdapter: UniqueIdAdapter,

    @inject('EmailAdapter')
    private readonly emailAdapter: EmailAdapter,

    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {}

  public async execute({
    email,
  }: RecoveryPasswordLinkServiceDto): Promise<void> {
    console.log(email);
  }
}
