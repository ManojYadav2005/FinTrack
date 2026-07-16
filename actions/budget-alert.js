"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { sendEmail } from "./send-email";
import EmailTemplate from "@/emails/template";

/**
 * Sends a budget alert email when expenses reach >= 80% of the monthly budget.
 * Called from the client via the BudgetProgress component.
 */
export async function sendBudgetAlertEmail({ budgetAmount, currentExpenses, percentageUsed }) {
  try {
    // Step A: Authentication & Database Connection (Kon aaya hai?)

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

     // Step B: Database se User ko nikalna
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");


    // Get email from Step C: Clerk se Fresh Email aur Naam mangwana (Yeh bahut smart step hai)

    const clerk = await clerkClient(); //// Clerk ki API ko access karne ka remote
    const clerkUser = await clerk.users.getUser(userId); //  // Clerk ke server se user ki taaza (fresh) jankari lao
    const email =      // // Email dhoondho: Pehle Clerk mein check karo, agar wahan nahi hai toh apne DB (user.email) se uthao
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      user.email;

    if (!email) {
      console.warn("No email found for user", userId);
      return { success: false, error: "No email on file" };
    }
    //nahi toh  // Naam dhoondho: Pehle Clerk ka firstName, nahi toh DB ka name, nahi toh simply "there" (jaise "Hello there")

    const userName = clerkUser.firstName || user.name || "there";


    const result = await sendEmail({
      to: email,
      subject: `⚠️ Budget Alert — You've used ${percentageUsed.toFixed(0)}% of your monthly budget`,
      react: EmailTemplate({ // EmailTemplate ek React Component hai jo sundar HTML email banata hai
        userName,
        type: "budget-alert",
        data: {
          percentageUsed,
          budgetAmount,
          totalExpenses: currentExpenses,
        },
      }),
    });

    return { success: result.success };    // Frontend, maine mail bhej di hai (success: true)."
  } catch (error) {
    console.error("Budget alert email error:", error);
    return { success: false, error: error.message };
  }
}
