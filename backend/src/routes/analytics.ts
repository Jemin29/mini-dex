import { Router } from "express";
import { analyticsSummary } from "@/controllers/analyticsController";

const router = Router();

router.get("/summary", analyticsSummary);

export default router;
