"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Budget } from "@/models/Budget";
import { Transaction } from "@/models/Transaction";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeDoc = (doc) => {
  if (!doc) return doc;
  const plainDoc = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const serialized = { ...plainDoc, id: plainDoc._id?.toString() || plainDoc.id };
  return JSON.parse(JSON.stringify(serialized));
};

// Fetch current budget and current month's expenses
export async function getCurrentBudget(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const budget = await Budget.findOne({ userId: user._id }).lean();

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const expensesResult = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          type: "EXPENSE",
          date: { $gte: startOfMonth, $lte: endOfMonth },
          accountId,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const currentExpenses =
      expensesResult.length > 0 ? expensesResult[0].totalAmount : 0;

    return {
      budget: budget ? serializeDoc(budget) : null,
      currentExpenses,
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

// Update or create budget
export async function updateBudget(amount) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const budget = await Budget.findOneAndUpdate(
      { userId: user._id },
      { amount },
      { new: true, upsert: true }
    ).lean();

    revalidatePath("/dashboard");

    return { success: true, data: serializeDoc(budget) };
  } catch (error) {
    console.error("Error updating budget:", error);
    throw new Error(error.message);
  }
}
