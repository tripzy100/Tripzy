import { Redis } from "@upstash/redis";

// Create client wrapper. Fallback to mock URL if environment variables are not supplied.
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "https://mock.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "mock-token",
});
export type RedisClient = typeof redis;
