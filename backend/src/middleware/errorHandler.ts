import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  const error = err instanceof Error ? err : new Error("Unknown error");
  res.status(500).json({
    error: {
      message: error.message
    }
  });
  next();
}
