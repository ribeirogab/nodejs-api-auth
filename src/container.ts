import { container } from 'tsyringe';

import { EmailAdapter, HashAdapter, UniqueIdAdapter } from './adapters';
import { EnvConfig } from './configs';
import { RegisterController, UserController } from './controllers';
import { ErrorHandler } from './errors/error-handler';
import { EmailTemplateRepository, RegisterTokenRepository, UserRepository } from './repositories';
import { AppRouter, RegisterRouter, UserRouter } from './routers';
import { CreateRegisterTokenService, CreateUserService, GetRegisterTokenService } from './services';

// Error handling
container.registerSingleton<ErrorHandler>('ErrorHandler', ErrorHandler);

// Configs
container.registerSingleton<EnvConfig>('EnvConfig', EnvConfig);

// Adapters
container.registerSingleton<UniqueIdAdapter>('UniqueIdAdapter', UniqueIdAdapter);
container.registerSingleton<EmailAdapter>('EmailAdapter', EmailAdapter);
container.registerSingleton<HashAdapter>('HashAdapter', HashAdapter);

// Repositories
container.registerSingleton<RegisterTokenRepository>('RegisterTokenRepository', RegisterTokenRepository);
container.registerSingleton<EmailTemplateRepository>('EmailTemplateRepository', EmailTemplateRepository);
container.registerSingleton<UserRepository>('UserRepository', UserRepository);

// Services
container.registerSingleton<CreateRegisterTokenService>('CreateRegisterTokenService', CreateRegisterTokenService);
container.registerSingleton<GetRegisterTokenService>('GetRegisterTokenService', GetRegisterTokenService);
container.registerSingleton<CreateUserService>('CreateUserService', CreateUserService);

// Controllers
container.registerSingleton<RegisterController>('RegisterController', RegisterController);
container.registerSingleton<UserController>('UserController', UserController);

// Routers
container.registerSingleton<RegisterRouter>('RegisterRouter', RegisterRouter);
container.registerSingleton<UserRouter>('UserRouter', UserRouter);
container.registerSingleton<AppRouter>('AppRouter', AppRouter);
