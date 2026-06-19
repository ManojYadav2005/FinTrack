// app/api/scan-receipt/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("receipt");

    if (!file) {
      return NextResponse.json({ error: "No receipt file provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type || "image/jpeg";

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a receipt data extractor. Analyze this receipt image and extract the following information in JSON format only (no markdown, no explanation, just raw JSON):

{
  "amount": <number - total amount paid, e.g. 45.99>,
  "date": "<ISO date string YYYY-MM-DD, e.g. 2024-01-15>",
  "description": "<merchant/store name or brief transaction description>",
  "category": "<one of: housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense>"
}

Rules:
- amount must be a number (no currency symbols)
- date must be YYYY-MM-DD format; if unclear use today's date: ${new Date().toISOString().split("T")[0]}
- description should be concise (merchant name preferred)
- category must exactly match one of the listed values
- If you cannot read the receipt clearly, make your best guess

Return ONLY the JSON object, nothing else.`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType,
        },
      },
      prompt,
    ]);

    const text = result.response.text().trim();

    // Strip any markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const data = JSON.parse(cleaned);

    // Validate & sanitize
    const sanitized = {
      amount: parseFloat(data.amount) || 0,
      date: data.date || new Date().toISOString().split("T")[0],
      description: String(data.description || "").slice(0, 100),
      category: data.category || "other-expense",
    };

    return NextResponse.json({ success: true, data: sanitized });
  } catch (error) {
    console.error("Receipt scan error:", error);
    return NextResponse.json(
      { error: "Failed to scan receipt. Please try again or enter details manually." },
      { status: 500 }
    );
  }
}
