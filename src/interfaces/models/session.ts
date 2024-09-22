import type { UserAuthProviderEnum } from './user-auth-provider';

export type Session = {
  provider: UserAuthProviderEnum;
  refresh_token: string;
  access_token: string;
  expires_at: string;
  user_id: string;
};

export type AuthenticationSession = Omit<Session, 'user_id' | 'provider'>;
