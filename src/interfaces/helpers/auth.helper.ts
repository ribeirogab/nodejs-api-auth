import type { Session } from '../models/session';
import type { UserAuthProviderEnum } from '../models/user-auth-provider';

export type AuthHelperGenerateSessionDto = {
  provider: UserAuthProviderEnum;
  user_id: string;
};

export interface AuthHelper {
  createSession(
    dto: AuthHelperGenerateSessionDto,
  ): Promise<Omit<Session, 'user_id' | 'provider'>>;
}
