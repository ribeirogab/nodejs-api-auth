import type { User } from '../models/user';

export type CreateUserDto = {
  user: Omit<User, 'id' | 'password_salt'>;
  token: string;
};

export interface CreateUserService {
  execute(dto: CreateUserDto): Promise<void>;
}
