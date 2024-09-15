import type { User } from '../models/user';

export type CreateUserServiceDto = {
  user: Omit<User, 'id' | 'password_salt'>;
  token: string;
};

export interface CreateUserService {
  execute(dto: CreateUserServiceDto): Promise<void>;
}
