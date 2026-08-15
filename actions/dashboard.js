"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Account } from "@/models/Account";
import { Transaction } from "@/models/Transaction";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeDoc = (doc) => {
  if (!doc) return doc;
  const plainDoc = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const serialized = { ...plainDoc, id: plainDoc._id?.toString() || plainDoc.id };
  return JSON.parse(JSON.stringify(serialized));
};

export async function getUserAccounts() { // Current logged-in user ke saare bank/accounts database se laana.
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await connectToDatabase();

  const user = await User.findOne({ clerkUserId: userId }).lean(); // MongoDB ka bhi userid le aata hai-> actual user ID hai.
  if (!user) throw new Error("User not found");

  try {
    const accounts = await Account.find({ userId: user._id })// 1. MongoDB mein user se related saare accounts nikalo.
      .sort({ createdAt: -1 })// Latest account pehle dikhao.
      .lean();
    // Har account ke transactions count karna
    const accountsWithCount = await Promise.all(
      accounts.map(async (acc) => { // Har account par ek-ek karke kaam karo. loop chalega ek tarah se har account pr
        const txCount = await Transaction.countDocuments({ accountId: acc._id }); // kitna transction hai har account se
        return {
          ...acc,
          _count: { transactions: txCount },
        };
      })
    );

    return accountsWithCount.map(serializeDoc);// Har account ko serialize karke frontend ko return kar deta hai.
  } catch (error) {
    console.error(error.message);
  }
}

// 2. Bank/Account create karna
export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId }).lean();
    if (!user) throw new Error("User not found");

    const balanceFloat = parseFloat(data.balance); // string se number mein banana
    if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

    const existingAccounts = await Account.find({ userId: user._id });
    const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;// User ka koi account nahi hai->pehla account automatically default account banega.,agr User ke already accounts hain-> Matlab user ne account create karte waqt isDefault jo value di hai, wahi use hogi.

    if (shouldBeDefault) { // Agar jo naya account hum bana rahe hain, woh default banne wala hai, tab ye code chalao, agr shouldbe->true hai tb chalega
      await Account.updateMany(
        { userId: user._id, isDefault: true }, //acount dhund kr default kr diya current ko// Agr user ke pehle se default accounts hain, to unko default se hata kar false kar do.
        { isDefault: false } //false kr diya kyuki naya account default hone wala hai.
      );
    }

    const account = await Account.create({ // Ab naya account create karo aur usko shouldBeDefault ke according default set karo.
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

  const user = await User.findOne({ clerkUserId: userId }).lean();
  if (!user) throw new Error("User not found");

  const transactions = await Transaction.find({ userId: user._id }) // current user ke saare accounts ki transactions.
    .sort({ date: -1 }) // latest transaction top pe dikhe
    .lean();

  return transactions.map(serializeDoc); // map() array ke har element par ek function apply karta hai.
}
