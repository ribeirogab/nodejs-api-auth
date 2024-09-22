import { inject, injectable } from 'tsyringe';

import {
  type AuthHelper,
  type AuthenticationSession,
  type SingleSignOnServiceDto,
  type SingleSignOnService as SingleSignOnServiceInterface,
  UserAuthProviderEnum,
  type UserAuthProviderRepository,
  type UserRepository,
} from '@/interfaces';

@injectable()
export class SingleSignOnService implements SingleSignOnServiceInterface {
  constructor(
    @inject('UserAuthProviderRepository')
    private readonly userAuthProviderRepository: UserAuthProviderRepository,

    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('AuthHelper')
    private readonly authHelper: AuthHelper,
  ) {}

  public async execute({
    providerId,
    provider,
    email,
    name,
  }: SingleSignOnServiceDto): Promise<AuthenticationSession> {
    const providerUserAuth = await this.userAuthProviderRepository.findOne({
      provider_id: providerId,
      provider,
    });

    if (providerUserAuth) {
      return this.authHelper.createSession({
        user_id: providerUserAuth.user_id,
        provider,
      });
    }

    const userId = await this.getOrCreateUserId({ email, name });

    await this.userAuthProviderRepository.create({
      provider_id: providerId,
      user_id: userId,
      provider,
    });

    return this.authHelper.createSession({ user_id: userId, provider });
  }

  private async getOrCreateUserId({
    email,
    name,
  }: {
    email?: string;
    name: string;
  }): Promise<string> {
    const userAuthEmail = await this.getAuthProviderEmail({ email });

    if (userAuthEmail) {
      return userAuthEmail.user_id;
    }

    const user = await this.userRepository.create({ email, name });
    const userId = user.id;

    if (email) {
      await this.userAuthProviderRepository.create({
        provider: UserAuthProviderEnum.Email,
        provider_id: email,
        user_id: userId,
      });
    }

    return userId;
  }

  private async getAuthProviderEmail({ email }: { email?: string }) {
    if (!email) {
      return null;
    }

    return this.userAuthProviderRepository.findOne({
      provider: UserAuthProviderEnum.Email,
      provider_id: email,
    });
  }
}
