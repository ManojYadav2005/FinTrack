"use server";

import { connectToDatabase } from "@/lib/mongoose"; //  database (MongoDB) se connection banata hai.
import { User } from "@/models/User";
import { Account } from "@/models/Account";
import { Transaction } from "@/models/Transaction";
import { auth } from "@clerk/nextjs/server";   // yeh clerk se aata hai 
import { revalidatePath } from "next/cache";
//  User, Account, Transaction: Yeh hamare database ke "models" hain. Inke zariye hum database se data read, write ya delete karte hain.
// Mongoose already stores as Number if we defined it that way,
// but we map _id to id and handle Dates if necessary.

const serializeDoc = (doc) => {  // MongoDB document ko normal JavaScript object mein convert karta hai.
  if (!doc) return doc;
  const plainDoc = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const serialized = { ...plainDoc, id: plainDoc._id?.toString() || plainDoc.id };
  return JSON.parse(JSON.stringify(serialized));
};


export async function getAccountWithTransactions(accountId) { // Yeh function kisi specific account ki details aur uske saare transactions nikal kar lata hai
 
  const { userId } = await auth(); // check karega clerk se login hai ya nhi if nahi then unauthirxed error
   // Step A: Check karna ki user logged in hai ya nahi
  if (!userId) throw new Error("Unauthorized");

  await connectToDatabase();  // Step B: Database se connect karna

  const user = await User.findOne({ clerkUserId: userId }).lean(); // Mongoose normally ek special document object return karta hai. //lean() lagane se simple JavaScript object milta hai.
  if (!user) throw new Error("User not found");

  const account = await Account.findOne({ // Account bhi match hona chahiye aur us account ka owner bhi current user hi hona chahiye.
    _id: accountId,
    userId: user._id,
  }).lean();

  if (!account) return null;
  // Step D: Us account se related saare transactions fetch karna

// Mujhe is account ki saari transactions laakar do.
  const transactions = await Transaction.find({ accountId })
    .sort({ date: -1 }) // Date ke hisaab se descending order mein arrange karo.
    .lean(); // Sirf plain JavaScript objects do

  return {
    ...serializeDoc(account), // ... Is object ke saare fields yahan copy kar do.
    transactions: transactions.map(serializeDoc), // serializeDoc(account)Account ko normal object mein convert karta hai.
    _count: {
      transactions: transactions.length,
    },
  };
}





export async function bulkDeleteTransactions(transactionIds) { // Yeh function ek saath bahut saari transactions ko delete karne ke kaam aata hai. Yeh thoda complex hai kyunki jab hum koi transaction delete karte hain, toh humein Account ka balance bhi wapas theek karna hota hai.
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    // Get transactions to calculate balance changes. 
    // Step A: Jo transactions delete karni hain, pehle unhe database se nikal lo
    const transactions = await Transaction.find({
      _id: { $in: transactionIds },
      userId: user._id,
    });

    // Step B: Calculate karna ki balance mein kitna farq (change) aayega
    // Agar humne 500 ka "EXPENSE" delete kiya, toh balance +500 hona chahiye.
    // Agar "INCOME" delete kiya, toh balance -500 hona chahiye.
    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      const change =
        transaction.type === "EXPENSE" ? transaction.amount : -transaction.amount; // income
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});


    // Mongoose transactions need a session
    //Ya to sab kuch hoga, ya kuch bhi nahi hoga.
    const session = await Account.startSession();///👉 MongoDB transaction start karne ke liye session banata hai.

    await session.withTransaction(async () => {
      // Delete transactions
      await Transaction.deleteMany(
        {
          _id: { $in: transactionIds },
          userId: user._id,
        },
        { session }
      );

      // Update account balances
      for (const [accId, balanceChange] of Object.entries(accountBalanceChanges)) {
        await Account.updateOne(
          { _id: accId },
          { $inc: { balance: balanceChange } },///👉$inc (increment) operator ka istemaal karke balance ko badha ya ghata raha hai.
          { session }
        );              //$inc: Existing value mein add/subtract karo.
      }
    });
    session.endSession();


    // Step D: UI ko bolna ki data change ho gaya hai, page reload karo
    revalidatePath("/dashboard");
    revalidatePath("/account/[id]"); // Account details page bhi refresh karo.

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Delete Transactions
//         ↓
// Update Balances
//         ↓
// Commit Transaction
//         ↓
// Refresh Dashboard Cache
//         ↓
// Refresh Account Cache
//         ↓
// Return success:true



////Jab user multiple accounts banata hai, toh wo kisi ek ko "Default" set kar sakta hai. Yeh function wahi kaam karta hai.
export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      throw new Error("User not found");
    }

    // Step A: Purane kisi bhi account se "isDefault: true" hata do (usko false kardo)
    // Kyunki ek time par ek hi account default ho sakta hai
    await Account.updateMany(
      {
        userId: user._id,
        isDefault: true,
      },
      { isDefault: false }
    );

   
    // Step B: Jo naya accountId aaya hai, usko "isDefault: true" set kardo
    const account = await Account.findOneAndUpdate(
      {
        _id: accountId,
        userId: user._id,
      },
      { isDefault: true },
      { new: true }  //   // 'new: true' ka matlab hai update hone ke baad naya wala data return karo
    ).lean();

    revalidatePath("/dashboard");
    return { success: true, data: serializeDoc(account) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
