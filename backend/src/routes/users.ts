import { Router } from "express";
import { getUserTransactions } from "@/controllers/userController";

const router = Router();

router.get("/:wallet/transactions", getUserTransactions);

export default router;
