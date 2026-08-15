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


export async function getCurrentBudget(accountId) { // budget nikalna + current month mein us account se kitna expense hua
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const budget = await Budget.findOne({ userId: user._id }).lean();// MongoDB ke Budget collection mein search ho raha hai.

    const currentDate = new Date();

    const startOfMonth = new Date( 
    currentDate.getFullYear(),
    currentDate.getMonth(),1); // pehla date, current month ka first day
    
      const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth()+1,0); // JavaScript mein agar date ka day 0 ho, to woh previous month ka last day deta hai.


    const expensesResult = await Transaction.aggregate([// Transactions mein se current user ke current account ke EXPENSE transactions nikalo aur unka total calculate karo.
      {
        $match: {
          userId: user._id, // Sirf current logged-in user ki transactions.
          type: "EXPENSE",
          date: { $gte: startOfMonth, $lte: endOfMonth }, // date >= month ka first day AND date <= month ka last day
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
      expensesResult.length > 0 ? expensesResult[0].totalAmount : 0; // Agar koi expense nahi mila: totalAmount 0 hoga

    return { // Response mein budget + current month ka total expense
      budget: budget ? serializeDoc(budget) : null, // Agar budget set nahi hai → null
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
      { new: true, upsert: true } // new ka matlab ->Update ke baad wala document return karo.     upsert ka matlab-> Update karo agar document exist karta hai, warna create karo.Budget.create() likhne ki zarurat nahi hai,ye automaticaaly budget update ke dega 
    ).lean();

    revalidatePath("/dashboard");

    return { success: true, data: serializeDoc(budget) };
  } catch (error) {
    console.error("Error updating budget:", error);
    throw new Error(error.message);
  }
}
