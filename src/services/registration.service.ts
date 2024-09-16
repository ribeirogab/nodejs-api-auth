import { inject, injectable } from 'tsyringe';

import type { HashAdapter } from '@/adapters';
import { AppErrorCodeEnum, HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import {
  type RegistrationServiceDto,
  type RegistrationService as RegistrationServiceInterface,
  type User,
  type UserRepository,
  type VerificationCodeRepository,
  VerificationCodeTypeEnum,
} from '@/interfaces';

@injectable()
export class RegistrationService implements RegistrationServiceInterface {
  constructor(
    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('VerificationCodeRepository')
    private verificationCodeRepository: VerificationCodeRepository,

    @inject('HashAdapter')
    private hashAdapter: HashAdapter,
  ) {}

  public async execute({
    password,
    email,
    name,
  }: RegistrationServiceDto): Promise<void> {
    const userExists = await this.userRepository.findByEmail({
      email,
    });

    if (userExists) {
      throw new AppError({
        message: AppErrorCodeEnum.EmailAlreadyInUse,
        status_code: HttpStatusCodesEnum.CONFLICT,
      });
    }

    const salt = this.hashAdapter.generateSalt();
    const hashedPassword = this.hashAdapter.hash({
      text: password,
      salt,
    });

    const content: Omit<User, 'id'> = {
      password: hashedPassword,
      password_salt: salt,
      email,
      name,
    };

    const expirationTimeInMinutes = 60; // 1 hour
    const expiresAt = new Date(
      Date.now() + expirationTimeInMinutes * 60 * 1000,
    ).toISOString();

    await this.verificationCodeRepository.create({
      type: VerificationCodeTypeEnum.Registration,
      expires_at: expiresAt,
      content,
    });
  }
}
