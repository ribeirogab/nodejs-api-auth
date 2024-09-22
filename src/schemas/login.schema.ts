import type { FastifySchema } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const loginSchema: FastifySchema = {
  body: zodToJsonSchema(
    z.object({
      email: z.string().email(),
    }),
  ),
};
