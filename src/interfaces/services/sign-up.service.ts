import type { User } from '../models/user';

export interface SignUpService {
  execute(dto: Omit<User, 'id'>): Promise<void>;
}
