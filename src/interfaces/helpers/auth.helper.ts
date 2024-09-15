import type { Session } from '../models/session';

export type AuthHelperGenerateSessionDto = {
  user_id: string;
};

export interface AuthHelper {
  createSession(dto: AuthHelperGenerateSessionDto): Promise<Session>;
}
