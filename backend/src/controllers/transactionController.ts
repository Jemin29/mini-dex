import type { Request, Response, NextFunction } from "express";
import { listTransactions } from "@/services/transactionService";
import { paginate } from "@/utils/pagination";

export async function getTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 10);
    const data = await listTransactions();
    const paged = paginate(data, page, pageSize);
    res.json({ ...paged, updatedAt: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
}
