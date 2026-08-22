import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getAccountWithTransactions,
  bulkDeleteTransactions,
  updateDefaultAccount,
} from "../controllers/accountController.js";

const router = express.Router();

// All account routes require authentication
router.use(requireAuth());

router.get("/:id", getAccountWithTransactions);
router.post("/bulk-delete", bulkDeleteTransactions);
router.post("/default", updateDefaultAccount);

export default router;
