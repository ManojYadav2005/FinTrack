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

export const getUserAccounts = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const accounts = await Account.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const accountsWithCount = await Promise.all(
      accounts.map(async (acc) => {
        const txCount = await Transaction.countDocuments({ accountId: acc._id });
        return {
          ...acc,
          _count: { transactions: txCount },
        };
      })
    );

    res.json(accountsWithCount.map(serializeDoc));
  } catch (error) {
    console.error("Error in getUserAccounts:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) return res.status(400).json({ error: "Invalid balance amount" });

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

    res.json({ success: true, data: serializeDoc(account) });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const transactions = await Transaction.find({ userId: user._id })
      .sort({ date: -1 })
      .lean();

    res.json(transactions.map(serializeDoc));
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: error.message });
  }
};
