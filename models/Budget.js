import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const budgetSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    amount: { type: Number, required: true },
    userId: { type: String, ref: "User", required: true, unique: true },
    lastAlertSent: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

budgetSchema.virtual("id").get(function () {
  return this._id;
});

export const Budget =
  mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
