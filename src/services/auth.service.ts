import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import type {
  AuthServiceDto,
  AuthService as AuthServiceInterface,
  HashAdapter,
  Session,
  UserRepository,
} from '@/interfaces';

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject('UserRepository') private readonly userRepository: UserRepository,

    @inject('HashAdapter') private readonly hashAdapter: HashAdapter,
  ) {}

  public async execute({
    password,
    email,
  }: AuthServiceDto): Promise<Omit<Session, 'user_id'>> {
    const user = await this.userRepository.findByEmail({ email });

    if (!user) {
      throw new AppError({
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    const passwordsMatch = this.hashAdapter.compare({
      decrypted: password,
      encrypted: user.password,
      salt: user.password_salt,
    });

    if (!passwordsMatch) {
      throw new AppError({
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    return {
      expires_at: new Date().toISOString(),
      refresh_token: 'refresh_token',
      access_token: 'access_token',
    };
  }
}
