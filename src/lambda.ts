import { awsLambdaFastify } from '@fastify/aws-lambda';

import { main } from './main';

export const handler = awsLambdaFastify(main().app);
