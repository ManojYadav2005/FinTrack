import { connectToDatabase } from "../lib/mongoose.js";
import { User } from "../models/User.js";
import { Budget } from "../models/Budget.js";
import { Transaction } from "../models/Transaction.js";

const serializeDoc = (doc) => {
  if (!doc) return doc;
  const plainDoc = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const serialized = { ...plainDoc, id: plainDoc._id?.toString() || plainDoc.id };
  return JSON.parse(JSON.stringify(serialized));
};

export const getCurrentBudget = async (req, res) => {
  try {
    const { accountId } = req.query;
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

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

    const matchQuery = {
      userId: user._id,
      type: "EXPENSE",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    };
    
    if (accountId) {
      matchQuery.accountId = accountId;
    }

    const expensesResult = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const currentExpenses =
      expensesResult.length > 0 ? expensesResult[0].totalAmount : 0;

    res.json({
      budget: budget ? serializeDoc(budget) : null,
      currentExpenses,
    });
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const budget = await Budget.findOneAndUpdate(
      { userId: user._id },
      { amount },
      { new: true, upsert: true }
    ).lean();

    res.json({ success: true, data: serializeDoc(budget) });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
