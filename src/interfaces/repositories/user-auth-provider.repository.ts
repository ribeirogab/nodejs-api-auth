import type {
  UserAuthProvider,
  UserAuthProviderEnum,
} from '../models/user-auth-provider';

export interface UserAuthProviderRepository {
  create(dto: UserAuthProvider): Promise<void>;

  findOne(dto: {
    provider: UserAuthProviderEnum;
    provider_id: string;
  }): Promise<UserAuthProvider | null>;
}
