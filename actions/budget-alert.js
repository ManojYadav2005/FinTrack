"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { sendEmail } from "./send-email";
import EmailTemplate from "@/emails/template";

/**
 * Sends a budget alert email when expenses reach >= 80% of the monthly budget.
 * Called from the client via the BudgetProgress component.
 */
export async function sendBudgetAlertEmail({ budgetAmount, currentExpenses, percentageUsed }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get user from DB
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Get email from Clerk
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const email =
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      user.email;

    if (!email) {
      console.warn("No email found for user", userId);
      return { success: false, error: "No email on file" };
    }

    const userName = clerkUser.firstName || user.name || "there";

    const result = await sendEmail({
      to: email,
      subject: `⚠️ Budget Alert — You've used ${percentageUsed.toFixed(0)}% of your monthly budget`,
      react: EmailTemplate({
        userName,
        type: "budget-alert",
        data: {
          percentageUsed,
          budgetAmount,
          totalExpenses: currentExpenses,
        },
      }),
    });

    return { success: result.success };
  } catch (error) {
    console.error("Budget alert email error:", error);
    return { success: false, error: error.message };
  }
}
