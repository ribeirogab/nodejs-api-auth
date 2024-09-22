import type { AuthenticationSession } from '../models/session';

export type RefreshLoginServiceDto = {
  refresh_token: string;
};

export interface RefreshLoginService {
  execute(dto: RefreshLoginServiceDto): Promise<AuthenticationSession>;
}
