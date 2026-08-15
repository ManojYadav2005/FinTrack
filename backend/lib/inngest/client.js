// import { Inngest } from "inngest";

// export const inngest = new Inngest({
//   id: "finance-platform", // Unique app ID
//   name: "Finance Platform",
//   retryFunction: async (attempt) => ({
//     delay: Math.pow(2, attempt) * 1000, // Exponential backoff
//     maxAttempts: 2,
//   }),
// });

import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "finance-platform",
  name: "Finance Platform",
  apiKey: process.env.INNGEST_API_KEY, // <-- load from env
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000,
    maxAttempts: 2,
  }),
});
