import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getUserAccounts,
  createAccount,
  getDashboardData,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.use(requireAuth());

router.get("/accounts", getUserAccounts);
router.post("/accounts", createAccount);
router.get("/data", getDashboardData);

export default router;
