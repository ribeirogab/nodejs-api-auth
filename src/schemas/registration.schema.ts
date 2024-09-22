import type { FastifySchema } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const registrationSchema: FastifySchema = {
  body: zodToJsonSchema(
    z.object({
      name: z.string().min(2).max(255),
      email: z.string().email(),
    }),
  ),
};
