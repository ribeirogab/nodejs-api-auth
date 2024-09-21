import { inject, injectable } from 'tsyringe';

import type { EnvConfig, JwtConfig } from '@/configs';
import {
  type LoginServiceDto,
  type LoginService as LoginServiceInterface,
  type UserRepository,
  type VerificationCodeRepository,
  VerificationCodeTypeEnum,
} from '@/interfaces';

@injectable()
export class LoginService implements LoginServiceInterface {
  constructor(
    @inject('VerificationCodeRepository')
    private verificationCodeRepository: VerificationCodeRepository,

    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('JwtConfig')
    private readonly jwtConfig: JwtConfig,

    @inject('EnvConfig')
    private readonly envConfig: EnvConfig,
  ) {}

  public async execute({ email }: LoginServiceDto): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail({ email });

    const token = this.jwtConfig.sign({
      secret: this.envConfig.JWT_SECRET_VERIFICATION_TOKEN,
      expiresIn: '10m',
      subject: email,
    });

    if (!user) {
      return { token };
    }

    const verificationCodeExists =
      await this.verificationCodeRepository.findOneByContent({
        code_type: VerificationCodeTypeEnum.Login,
        content: { key: 'email', value: email },
      });

    if (verificationCodeExists) {
      await this.verificationCodeRepository.deleteOne({
        code_type: VerificationCodeTypeEnum.Login,
        token: verificationCodeExists.token,
      });
    }

    const expirationTimeInMinutes = 10; // 10 minutes
    const expiresAt = new Date(
      Date.now() + expirationTimeInMinutes * 60 * 1000,
    ).toISOString();

    await this.verificationCodeRepository.create({
      code_type: VerificationCodeTypeEnum.Login,
      code_expires_at: expiresAt,
      content: { email },
      token,
    });

    return { token };
  }
}
