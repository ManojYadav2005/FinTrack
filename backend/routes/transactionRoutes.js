import express from "express";
import { requireAuth } from "@clerk/express";
import {
  createTransaction,
  getTransaction,
  updateTransaction,
  getUserTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(requireAuth());

router.post("/", createTransaction);
router.get("/", getUserTransactions);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);

export default router;
