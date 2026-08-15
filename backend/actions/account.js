"use server"; // sirf server pe chalega

import { connectToDatabase } from "@/backend/lib/mongoose";
import { User } from "@/backend/models/User";
import { Account } from "@/backend/models/Account";
import { Transaction } from "@/backend/models/Transaction";
import { auth } from "@clerk/nextjs/server"; //server se user id lega,server pe kaam karta hai 
import { revalidatePath } from "next/cache";

const serializeDoc = (doc) => { // convert Mongoose documents into plain JavaScript objects
  if (!doc) return doc;
  const plainDoc = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const serialized = { ...plainDoc, id: plainDoc._id?.toString() || plainDoc.id };
  return JSON.parse(JSON.stringify(serialized));
};

//1. get account details with all transactions and count of transactions
export async function getAccountWithTransactions(accountId) {
  const { userId } = await auth(); // Clerk's auth() to get the currently authenticated user's ID
  if (!userId) throw new Error("Unauthorized");

  await connectToDatabase();

  const user = await User.findOne({  //Find this account only if it belongs to the currently logged-in user.
  clerkUserId: userId  // ye clerk vala id hai ,aur ye mongodb mein search krke tumhe ,mongodb ka id dega user._id kre jo hai
}).lean();

  if (!user) throw new Error("User not found");

  const account = await Account.findOne({
    _id: accountId, 
    userId: user._id,  // userId MongoDB wala user ID
  }).lean(); // Give me a plain JavaScript object instead of a full Mongoose Document

  if (!account) return null;

  const transactions = await Transaction.find({ accountId })
    .sort({ date: -1 })
    .lean();

  return {
    ...serializeDoc(account),
    transactions: transactions.map(serializeDoc),
    _count: {
      transactions: transactions.length,
    },
  };
}

//2. bulkDeleteTransactions
export async function bulkDeleteTransactions(transactionIds) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const transactions = await Transaction.find({
      _id: { $in: transactionIds }, // Jo transaction IDs user ne delete karne ke liye bheji hain, unmein se transactions find karo
      userId: user._id, // Lekin sirf current logged-in user ki transactions.
    });
    //ye ek object banayega jisme har account id ke liye total amount store hoga
    const accountBalanceChanges = transactions.reduce((acc, transaction) => { // Transaction delete hone ke baad har account ka balance kitna change karna hai?,       reduce() multiple transactions ko process karke ek final object banata hai.
      const change =
        transaction.type === "EXPENSE" ? transaction.amount : -transaction.amount;// EXPENSE → +amount , INCOME → -amount
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});
//transaction delete krne se pahle balance ko update kro ,taaki balance sahi rahe,Both should either succeed together or fail together,
    const session = await Account.startSession();

    await session.withTransaction(async () => {
      await Transaction.deleteMany(
        { _id: { $in: transactionIds }, userId: user._id },
        { session } //Ye delete operation current transaction ke andar execute karo.
      );
      //Ab har account ka balance update hoga jo upar banaya hai
      for (const [accId, balanceChange] of Object.entries(accountBalanceChanges)) {
        await Account.updateOne(
          { _id: accId },
          { $inc: { balance: balanceChange } },//$inc → Balance ko badhana ya kam karna
          { session }
        );
      }
    });
    session.endSession();//session ko band krdo

    revalidatePath("/dashboard"); //path ko update krdo,taaki new data dikhe
    revalidatePath("/account/[id]");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


//update default account
export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    await Account.updateMany(
      { userId: user._id, isDefault: true }, // urrent user ke jitne bhi accounts hain aur isDefault: true hai, un sabko false kar do.
      { isDefault: false }
    );

    const account = await Account.findOneAndUpdate(
      { _id: accountId, userId: user._id }, // Ab us account ko default banao jise select kiya hai.
      { isDefault: true },
      { new: true }
    ).lean();

    revalidatePath("/dashboard");
    return { success: true, data: serializeDoc(account) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
