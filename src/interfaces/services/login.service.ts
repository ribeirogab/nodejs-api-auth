import type { Session } from '../models/session';

export type LoginServiceDto = {
  email: string;
  password: string;
};

export interface LoginService {
  execute(dto: LoginServiceDto): Promise<Omit<Session, 'user_id'>>;
}
