import { Redis } from "@upstash/redis";

let cachedClient = null;

export function getRedisClient() {
  if (!cachedClient) {
    cachedClient = Redis.fromEnv();
  }
  return cachedClient;
}
