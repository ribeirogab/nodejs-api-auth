import 'reflect-metadata';
import { container } from 'tsyringe';
import type { Mocked } from 'vitest';

import { CreateUserService } from './create-user.service';
import type { User, UserRepository } from '@/interfaces';

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let userRepositoryMock: Mocked<UserRepository>;

  beforeEach(() => {
    userRepositoryMock = {
      create: vi.fn(),
    } as unknown as Mocked<UserRepository>;

    container.registerInstance('UserRepository', userRepositoryMock);
    createUserService = container.resolve(CreateUserService);
  });

  it('should call userRepository.create with the correct user data', async () => {
    const user: Omit<User, 'id'> = {
      email: 'john@example.com',
      name: 'John Doe',
      password: '123',
    };

    await createUserService.execute(user);

    expect(userRepositoryMock.create).toHaveBeenCalledWith(user);
  });
});
