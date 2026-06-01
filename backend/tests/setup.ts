import { beforeAll } from "vitest";

beforeAll(() => {
  process.env.CACHE_PROVIDER = "memory";
  process.env.RATE_LIMIT_MAX = "10000";
  process.env.CORS_ORIGIN = "http://localhost:3000";
});
