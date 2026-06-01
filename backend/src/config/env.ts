import "dotenv/config";

type Env = {
  nodeEnv: string;
  port: number;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  redisUrl: string | null;
  cacheProvider: "redis" | "memory";
  wsPath: string;
  logFormat: string;
  trustProxy: boolean;
};

function numberOr(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env: Env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: numberOr(process.env.PORT, 4000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  rateLimitWindowMs: numberOr(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  rateLimitMax: numberOr(process.env.RATE_LIMIT_MAX, 120),
  redisUrl: process.env.REDIS_URL || null,
  cacheProvider: (process.env.CACHE_PROVIDER as Env["cacheProvider"]) || "memory",
  wsPath: process.env.WS_PATH || "/ws",
  logFormat: process.env.LOG_FORMAT || (process.env.NODE_ENV === "production" ? "combined" : "dev"),
  trustProxy: process.env.TRUST_PROXY === "true"
};
