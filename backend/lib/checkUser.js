import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "./mongoose";
import { User } from "@/backend/models/User";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) return null;

  try {
    await connectToDatabase();

    const loggedInUser = await User.findOne({ clerkUserId: user.id });
    if (loggedInUser) return loggedInUser;

    const newUser = await User.create({
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    });

    return newUser;
  } catch (error) {
    // DB connect nahi hua (e.g. IP whitelist issue) — gracefully null return karo
    // App crash nahi karegi, sirf user sync skip hoga
    console.error("checkUser error:", error.message);
    return null;
  }
};
