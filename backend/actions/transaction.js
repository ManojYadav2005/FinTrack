"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/backend/lib/mongoose";
import { User } from "@/backend/models/User";
import { Account } from "@/backend/models/Account";
import { Transaction } from "@/backend/models/Transaction";
import { Budget } from "@/backend/models/Budget";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/backend/actions/send-email";
import EmailTemplate from "@/backend/emails/template";
import mongoose from "mongoose";

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

export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const account = await Account.findOne({
      _id: data.accountId,
      userId: user._id,
    });
    if (!account) throw new Error("Account not found");

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

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

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
                react: EmailTemplate({
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

    return { success: true, data: serializeDoc(transaction) };
  } catch (error) {
    console.error("Create Transaction Error:", error);
    throw new Error(error.message);
  }
}

export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await connectToDatabase();

  const user = await User.findOne({ clerkUserId: userId });
  if (!user) throw new Error("User not found");

  const transaction = await Transaction.findOne({
    _id: id,
    userId: user._id,
  }).lean();
  if (!transaction) throw new Error("Transaction not found");

  return serializeDoc(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const originalTransaction = await Transaction.findOne({
      _id: id,
      userId: user._id,
    }).populate("accountId");
    if (!originalTransaction) throw new Error("Transaction not found");

    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount
        : originalTransaction.amount;

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

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeDoc(updated) };
  } catch (error) {
    console.error("Update Transaction Error:", error);
    throw new Error(error.message);
  }
}

export async function getUserTransactions(query = {}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const transactions = await Transaction.find({ userId: user._id, ...query })
      .populate("accountId")
      .sort({ date: -1 })
      .lean();

    return { success: true, data: transactions.map(serializeDoc) };
  } catch (error) {
    console.error("Get Transactions Error:", error);
    throw new Error(error.message);
  }
}
