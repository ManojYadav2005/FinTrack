import express from "express";
import { requireAuth, clerkClient } from "@clerk/express";
import { connectToDatabase } from "../lib/mongoose.js";
import { User } from "../models/User.js";

const router = express.Router();

// POST /api/auth/sync
// Called by the frontend after Clerk login to ensure user exists in MongoDB
router.post("/sync", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();

    // Check if user already exists in our DB
    let user = await User.findOne({ clerkUserId: userId });
    if (user) return res.json({ success: true, data: user });

    // Fetch user details from Clerk
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);

    // Create user in MongoDB
    user = await User.create({
      clerkUserId: userId,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      imageUrl: clerkUser.imageUrl,
      email: clerkUser.emailAddresses[0]?.emailAddress,
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Auth sync error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
