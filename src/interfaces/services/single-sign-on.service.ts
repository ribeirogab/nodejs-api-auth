import type { AuthenticationSession } from '../models/session';
import type { UserAuthProviderEnum } from '../models/user-auth-provider';

export type SingleSignOnServiceDto = {
  provider: UserAuthProviderEnum;
  providerId: string;
  email?: string;
  name: string;
};

export interface SingleSignOnService {
  execute(data: SingleSignOnServiceDto): Promise<AuthenticationSession>;
}
