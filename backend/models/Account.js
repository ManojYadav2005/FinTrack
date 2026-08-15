import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const accountSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    type: { type: String, enum: ["CURRENT", "SAVINGS"], required: true },
    balance: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
    userId: { type: String, ref: "User", required: true, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

accountSchema.virtual("id").get(function () {
  return this._id;
});

export const Account = mongoose.models.Account || mongoose.model("Account", accountSchema);
