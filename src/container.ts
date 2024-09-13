import { container } from 'tsyringe';

import { EnvConfig } from './configs';
import { UserController } from './controllers';
import { UserRepository } from './repositories';
import { AppRouter, UserRouter } from './routers';
import { CreateUserService, ListUsersService } from './services';

// Configs
container.registerSingleton<EnvConfig>('EnvConfig', EnvConfig);

// Repositories
container.registerSingleton<UserRepository>('UserRepository', UserRepository);

// Services
container.registerSingleton<CreateUserService>(
  'CreateUserService',
  CreateUserService,
);

container.registerSingleton<ListUsersService>(
  'ListUsersService',
  ListUsersService,
);

// Controllers
container.registerSingleton<UserController>('UserController', UserController);

// Routers
container.registerSingleton<UserRouter>('UserRouter', UserRouter);
container.registerSingleton<AppRouter>('AppRouter', AppRouter);
