import type { FastifySchema } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const loginRefreshSchema: FastifySchema = {
  body: zodToJsonSchema(
    z.object({
      refresh_token: z.string(),
    }),
  ),
};
