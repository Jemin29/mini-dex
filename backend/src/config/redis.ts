import Redis from "ioredis";
import { env } from "@/config/env";

let client: Redis | null = null;

export function getRedisClient() {
  if (!env.redisUrl) return null;
  if (!client) {
    client = new Redis(env.redisUrl, { lazyConnect: true });
    client.connect().catch(() => undefined);
  }
  return client;
}
