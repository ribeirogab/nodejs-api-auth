import type { Session } from '../models/session';

export type LoginConfirmServiceDto = {
  token: string;
  code: string;
};

export interface LoginConfirmService {
  execute(dto: LoginConfirmServiceDto): Promise<Omit<Session, 'user_id'>>;
}
