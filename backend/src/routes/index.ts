import { Router } from "express";
import analytics from "@/routes/analytics";
import tokens from "@/routes/tokens";
import pools from "@/routes/pools";
import transactions from "@/routes/transactions";
import users from "@/routes/users";
import health from "@/routes/health";

const router = Router();

router.use("/health", health);
router.use("/analytics", analytics);
router.use("/tokens", tokens);
router.use("/pools", pools);
router.use("/transactions", transactions);
router.use("/users", users);

export default router;
