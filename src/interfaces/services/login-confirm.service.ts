import type { AuthenticationSession } from '../models/session';

export type LoginConfirmServiceDto = {
  token: string;
  code: string;
};

export interface LoginConfirmService {
  execute(dto: LoginConfirmServiceDto): Promise<AuthenticationSession>;
}
