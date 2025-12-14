import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    OPENROUTER_API_KEY: z.string().min(1),
    GOOGLE_API_KEY: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    VERCEL_URL: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,

    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },
});
