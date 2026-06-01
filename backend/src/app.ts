import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "@/routes";
import { env } from "@/config/env";
import { apiRateLimit } from "@/middleware/rateLimit";
import { requestId } from "@/middleware/requestId";
import { errorHandler } from "@/middleware/errorHandler";
import { notFound } from "@/middleware/notFound";

export function createApp() {
  const app = express();

  if (env.trustProxy) {
    app.set("trust proxy", 1);
  }

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.logFormat));
  app.use(requestId);
  app.use(apiRateLimit);

  app.use("/api", routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
