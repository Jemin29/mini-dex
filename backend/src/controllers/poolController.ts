import type { Request, Response, NextFunction } from "express";
import { listPools } from "@/services/poolService";

export async function getPools(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await listPools();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}
