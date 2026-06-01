import type { Request, Response, NextFunction } from "express";
import { listTokens } from "@/services/tokenService";

export async function getTokens(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await listTokens();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}
