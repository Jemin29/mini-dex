import type { Request, Response, NextFunction } from "express";
import { getAnalyticsSummary } from "@/services/analyticsService";

export async function analyticsSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getAnalyticsSummary();
    res.json({ data, updatedAt: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
}
