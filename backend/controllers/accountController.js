import { connectToDatabase } from "../lib/mongoose.js";
import { User } from "../models/User.js";
import { Account } from "../models/Account.js";
import { Transaction } from "../models/Transaction.js";

const serializeDoc = (doc) => {
  if (!doc) return doc;
  const plainDoc = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const serialized = { ...plainDoc, id: plainDoc._id?.toString() || plainDoc.id };
  return JSON.parse(JSON.stringify(serialized));
};

export const getAccountWithTransactions = async (req, res) => {
  try {
    const { id: accountId } = req.params;
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const account = await Account.findOne({
      _id: accountId,
      userId: user._id,
    }).lean();

    if (!account) return res.status(404).json({ error: "Account not found" });

    const transactions = await Transaction.find({ accountId })
      .sort({ date: -1 })
      .lean();

    res.json({
      ...serializeDoc(account),
      transactions: transactions.map(serializeDoc),
      _count: {
        transactions: transactions.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkDeleteTransactions = async (req, res) => {
  try {
    const { transactionIds } = req.body;
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const transactions = await Transaction.find({
      _id: { $in: transactionIds },
      userId: user._id,
    });

    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      const change =
        transaction.type === "EXPENSE" ? transaction.amount : -transaction.amount;
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    const session = await Account.startSession();

    await session.withTransaction(async () => {
      await Transaction.deleteMany(
        { _id: { $in: transactionIds }, userId: user._id },
        { session }
      );
      for (const [accId, balanceChange] of Object.entries(accountBalanceChanges)) {
        await Account.updateOne(
          { _id: accId },
          { $inc: { balance: balanceChange } },
          { session }
        );
      }
    });
    session.endSession();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDefaultAccount = async (req, res) => {
  try {
    const { accountId } = req.body;
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    await Account.updateMany(
      { userId: user._id, isDefault: true },
      { isDefault: false }
    );

    const account = await Account.findOneAndUpdate(
      { _id: accountId, userId: user._id },
      { isDefault: true },
      { new: true }
    ).lean();

    res.json({ success: true, data: serializeDoc(account) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
