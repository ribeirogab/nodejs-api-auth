import { main } from './main';

const { app, logger, envConfig } = main();

app
  .listen({ port: envConfig.PORT })
  .then(() =>
    logger.info(`Server running on http://localhost:${envConfig.PORT}`, {
      LOGGER_PROVIDER: envConfig.LOGGER_PROVIDER,
      LOG_LEVEL: envConfig.LOG_LEVEL,
      NODE_ENV: envConfig.NODE_ENV,
      STAGE: envConfig.STAGE,
    }),
  )
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
