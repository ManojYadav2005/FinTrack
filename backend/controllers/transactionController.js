import mongoose from "mongoose";
import { connectToDatabase } from "../lib/mongoose.js";
import { User } from "../models/User.js";
import { Account } from "../models/Account.js";
import { Transaction } from "../models/Transaction.js";
import { Budget } from "../models/Budget.js";

import { sendEmail } from "../lib/send-email.js";
import EmailTemplate from "../emails/template.js";
const serializeDoc = (doc) => {
  if (!doc) return doc;
  const plainDoc = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const serialized = { ...plainDoc, id: plainDoc._id?.toString() || plainDoc.id };
  return JSON.parse(JSON.stringify(serialized));
};

function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);
  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      return null;
  }
  return date;
}

export const createTransaction = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const account = await Account.findOne({
      _id: data.accountId,
      userId: user._id,
    });
    if (!account) return res.status(404).json({ error: "Account not found" });

    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;

    let transaction;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const nextRecurringDate =
        data.isRecurring && data.recurringInterval
          ? calculateNextRecurringDate(data.date, data.recurringInterval)
          : null;

      const [newTx] = await Transaction.create(
        [{ ...data, userId: user._id, nextRecurringDate }],
        { session }
      );
      transaction = newTx;

      await Account.updateOne(
        { _id: data.accountId },
        { $inc: { balance: balanceChange } },
        { session }
      );
    });
    session.endSession();

    // Budget alert logic
    if (data.type === "EXPENSE") {
      try {
        const budget = await Budget.findOne({ userId: user._id });

        if (budget) {
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);

          const result = await Transaction.aggregate([
            {
              $match: {
                userId: user._id,
                accountId: data.accountId,
                type: "EXPENSE",
                date: { $gte: startOfMonth },
              },
            },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
          ]);

          const totalExpenses = result.length > 0 ? result[0].totalAmount : 0;
          const budgetAmount = budget.amount;
          const percentageUsed = (totalExpenses / budgetAmount) * 100;

          const alreadyAlertedThisMonth =
            budget.lastAlertSent &&
            new Date(budget.lastAlertSent).getMonth() === new Date().getMonth() &&
            new Date(budget.lastAlertSent).getFullYear() === new Date().getFullYear();

          if (percentageUsed >= 80 && !alreadyAlertedThisMonth) {
            const { clerkClient } = await import("@clerk/express");
            const clerk = await clerkClient();
            const clerkUser = await clerk.users.getUser(userId);
            const email = clerkUser.emailAddresses?.[0]?.emailAddress || user.email;
            const userName = clerkUser.firstName || user.name || "there";
            const isOverBudget = percentageUsed >= 100;

            if (email) {
              await sendEmail({
                to: email,
                subject: isOverBudget
                  ? `🚨 Budget Exceeded! You've gone over your monthly budget`
                  : `⚠️ Budget Alert — You've used ${percentageUsed.toFixed(0)}% of your monthly budget`,
                html: EmailTemplate({
                  userName,
                  type: "budget-alert",
                  data: { percentageUsed, budgetAmount, totalExpenses },
                }),
              });
              await Budget.updateOne(
                { _id: budget._id },
                { lastAlertSent: new Date() }
              );
            }
          }
        }
      } catch (alertError) {
        console.error("Budget alert error:", alertError);
      }
    }
    res.json({ success: true, data: serializeDoc(transaction) });
  } catch (error) {
    console.error("Create Transaction Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const transaction = await Transaction.findOne({
      _id: id,
      userId: user._id,
    }).lean();
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });

    res.json(serializeDoc(transaction));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const originalTransaction = await Transaction.findOne({
      _id: id,
      userId: user._id,
    }).populate("accountId");
    if (!originalTransaction) return res.status(404).json({ error: "Transaction not found" });

    const oldBalanceChange =
      originalTransaction.type === "EXPENSE" ? -originalTransaction.amount : originalTransaction.amount;
    const newBalanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const netBalanceChange = newBalanceChange - oldBalanceChange;

    let updated;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const nextRecurringDate =
        data.isRecurring && data.recurringInterval
          ? calculateNextRecurringDate(data.date, data.recurringInterval)
          : null;

      updated = await Transaction.findOneAndUpdate(
        { _id: id, userId: user._id },
        { ...data, nextRecurringDate },
        { new: true, session }
      );

      await Account.updateOne(
        { _id: data.accountId },
        { $inc: { balance: netBalanceChange } },
        { session }
      );
    });
    session.endSession();

    res.json({ success: true, data: serializeDoc(updated) });
  } catch (error) {
    console.error("Update Transaction Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const query = req.query; // Supports passing ?type=EXPENSE
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const transactions = await Transaction.find({ userId: user._id, ...query })
      .populate("accountId")
      .sort({ date: -1 })
      .lean();

    res.json({ success: true, data: transactions.map(serializeDoc) });
  } catch (error) {
    console.error("Get Transactions Error:", error);
    res.status(500).json({ error: error.message });
  }
};
