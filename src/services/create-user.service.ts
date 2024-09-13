import { inject, injectable } from 'tsyringe';

import type { User, UserRepository } from '@/interfaces';

@injectable()
export class CreateUserService {
  constructor(
    @inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  public async execute(user: Omit<User, 'id'>): Promise<void> {
    return this.userRepository.create(user);
  }
}
