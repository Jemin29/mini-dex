import type { Request, Response, NextFunction } from "express";
import { getUserActivity } from "@/services/userService";
import { paginate } from "@/utils/pagination";

export async function getUserTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const wallet = req.params.wallet;
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 10);
    const data = await getUserActivity(wallet);
    const paged = paginate(data, page, pageSize);
    res.json({ ...paged, wallet, updatedAt: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
}
