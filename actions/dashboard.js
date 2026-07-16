"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Account } from "@/models/Account";
import { Transaction } from "@/models/Transaction";
import { checkUser } from "@/lib/checkUser";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeDoc = (doc) => {
  if (!doc) return doc;
  const plainDoc = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const serialized = { ...plainDoc, id: plainDoc._id?.toString() || plainDoc.id };
  return JSON.parse(JSON.stringify(serialized));
};

export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await connectToDatabase();

  const user = await checkUser();
  if (!user) {
    throw new Error("User not found");
  }

  try {
    const accounts = await Account.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const accountsWithCount = await Promise.all(
      accounts.map(async (acc) => {
        const txCount = await Transaction.countDocuments({ accountId: acc._id });
        return {
          ...acc,
          _count: {
            transactions: txCount,
          },
        };
      })
    );

    return accountsWithCount.map(serializeDoc);
  } catch (error) {
    console.error(error.message);
  }
}

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");


    await connectToDatabase();

    const user = await checkUser();
    if (!user) {
      throw new Error("User not found");
    }

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    const existingAccounts = await Account.find({ userId: user._id });
    const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await Account.updateMany(
        { userId: user._id, isDefault: true },
        { isDefault: false }
      );
    }

    const account = await Account.create({
      ...data,
      balance: balanceFloat,
      userId: user._id,
      isDefault: shouldBeDefault,
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeDoc(account) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await connectToDatabase();

  const user = await checkUser();
  if (!user) {
    throw new Error("User not found");
  }

  const transactions = await Transaction.find({ userId: user._id })
    .sort({ date: -1 })
    .lean();

  return transactions.map(serializeDoc);
}
