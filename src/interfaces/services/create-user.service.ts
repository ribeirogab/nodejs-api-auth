import type { User } from '../models/user';

export type CreateUserDto = {
  user: Omit<User, 'id'>;
  token: string;
};

export interface CreateUserService {
  execute(dto: CreateUserDto): Promise<void>;
}
