import { main } from './main';

const { app, envConfig } = main();

app
  .listen({ port: envConfig.PORT })
  .then(() =>
    console.log(`Server running on http://localhost:${envConfig.PORT}`),
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
