"use server";

import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) { // sendEmail naam se ek function hai, jo to, subject, react ye 3 cheezein le raha hai.
  const resend = new Resend(process.env.RESEND_API_KEY || "");// "Resend, ye meri API key hai; ab mujhe email send karne do."

  try {
    const data = await resend.emails.send({
      from: "Finance App <onboarding@resend.dev>", //<onboarding@resend.dev> Resend ke testing/development setup ke liye use hota ha
      to,
      subject,
      react,//react -> HTML/JSX ka content jo email mein dikhega
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
// email bhejne ke liye hai.
