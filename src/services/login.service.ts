import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import type {
  AuthHelper,
  LoginServiceDto,
  LoginService as LoginServiceInterface,
  HashAdapter,
  Session,
  UserRepository,
} from '@/interfaces';

@injectable()
export class LoginService implements LoginServiceInterface {
  constructor(
    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('HashAdapter')
    private readonly hashAdapter: HashAdapter,

    @inject('AuthHelper')
    private readonly authHelper: AuthHelper,
  ) {}

  public async execute({
    password,
    email,
  }: LoginServiceDto): Promise<Omit<Session, 'user_id'>> {
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

    const session = await this.authHelper.createSession({ user_id: user.id });

    return {
      refresh_token: session.refresh_token,
      access_token: session.access_token,
      expires_at: session.expires_at,
    };
  }
}
