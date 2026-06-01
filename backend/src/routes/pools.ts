import { Router } from "express";
import { getPools } from "@/controllers/poolController";

const router = Router();

router.get("/", getPools);

export default router;
