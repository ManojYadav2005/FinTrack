import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const transactionSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    receiptUrl: { type: String },
    isRecurring: { type: Boolean, default: false },
    recurringInterval: {
      type: String,
      enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
    },
    nextRecurringDate: { type: Date },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "COMPLETED",
    },
    userId: { type: String, ref: "User", required: true, index: true },
    accountId: { type: String, ref: "Account", required: true, index: true },
    category: { type: String, required: true },
    lastProcessed: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

transactionSchema.virtual("id").get(function () {
  return this._id;
});

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
