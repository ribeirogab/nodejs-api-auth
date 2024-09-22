import type { FastifySchema } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const registrationConfirmSchema: FastifySchema = {
  body: zodToJsonSchema(
    z.object({
      code: z.string().min(6).max(6),
      token: z.string(),
    }),
  ),
};
