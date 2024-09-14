import { inject, injectable } from 'tsyringe';

import { AppErrorCodeEnum, HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import type {
  CreateUserDto,
  CreateUserService as CreateUserServiceInterface,
  RegisterTokenRepository,
  UserRepository,
} from '@/interfaces';

@injectable()
export class CreateUserService implements CreateUserServiceInterface {
  constructor(
    @inject('RegisterTokenRepository')
    private readonly registerTokenRepository: RegisterTokenRepository,

    @inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  public async execute({ token, user }: CreateUserDto): Promise<void> {
    const registerToken = await this.registerTokenRepository.findById({
      id: token,
    });

    if (!registerToken || registerToken.external_id !== user.email) {
      throw new AppError({
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    const userExists = await this.userRepository.findByEmail({
      email: user.email,
    });

    if (userExists) {
      throw new AppError({
        message: AppErrorCodeEnum.EmailAlreadyInUse,
        status_code: HttpStatusCodesEnum.CONFLICT,
      });
    }

    await this.userRepository.create(user);
  }
}
