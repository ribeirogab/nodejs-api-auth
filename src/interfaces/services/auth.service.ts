import type { Session } from '../models/session';

export type AuthServiceDto = {
  email: string;
  password: string;
};

export interface AuthService {
  execute(dto: AuthServiceDto): Promise<Omit<Session, 'user_id'>>;
}
