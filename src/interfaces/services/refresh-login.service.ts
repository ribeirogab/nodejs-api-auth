import type { Session } from '../models/session';

export type RefreshLoginServiceDto = {
  refresh_token: string;
};

export interface RefreshLoginService {
  execute(dto: RefreshLoginServiceDto): Promise<Omit<Session, 'user_id'>>;
}
