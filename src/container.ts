import { container } from 'tsyringe';

import { EnvConfig } from './configs';
import { RegisterController, UserController } from './controllers';
import { RegisterTokenRepository, UserRepository } from './repositories';
import { AppRouter, RegisterRouter, UserRouter } from './routers';
import {
  CreateRegisterTokenService,
  CreateUserService,
  GetRegisterTokenService,
} from './services';

// Configs
container.registerSingleton<EnvConfig>('EnvConfig', EnvConfig);

// Repositories
container.registerSingleton<RegisterTokenRepository>(
  'RegisterTokenRepository',
  RegisterTokenRepository,
);

container.registerSingleton<UserRepository>('UserRepository', UserRepository);

// Services
container.registerSingleton<CreateUserService>(
  'CreateUserService',
  CreateUserService,
);

container.registerSingleton<CreateRegisterTokenService>(
  'CreateRegisterTokenService',
  CreateRegisterTokenService,
);

container.registerSingleton<GetRegisterTokenService>(
  'GetRegisterTokenService',
  GetRegisterTokenService,
);

// Controllers
container.registerSingleton<UserController>('UserController', UserController);

container.registerSingleton<RegisterController>(
  'RegisterController',
  RegisterController,
);

// Routers
container.registerSingleton<RegisterRouter>('RegisterRouter', RegisterRouter);
container.registerSingleton<UserRouter>('UserRouter', UserRouter);
container.registerSingleton<AppRouter>('AppRouter', AppRouter);
