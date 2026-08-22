import express from "express";
import { requireAuth } from "@clerk/express";
import { getCurrentBudget, updateBudget } from "../controllers/budgetController.js";

const router = express.Router();

router.use(requireAuth());

router.get("/", getCurrentBudget);
router.post("/", updateBudget);

export default router;
