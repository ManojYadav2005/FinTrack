import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for id (Mongoose adds this by default for _id, but good to be explicit if needed)
userSchema.virtual("id").get(function () {
  return this._id;
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
