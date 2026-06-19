# FinTrack 🚀

![FinTrack Banner](public/banner.jpeg)

**FinTrack** is a premium, AI-powered personal finance dashboard designed for developers and power users. Built with a unique "Dark Mode SQL Database" aesthetic, FinTrack treats your finances like precise, queryable data, offering maximum clarity over your money.

## ✨ Key Features

- 🖥️ **SQL-Themed Dashboard:** A beautiful, terminal-inspired interface featuring monospace typography, glowing accents, and database-grid layouts.
- 🤖 **AI Receipt Scanner:** Powered by **Google Gemini 2.5 Flash**, simply drag-and-drop a receipt image and watch as the amount, date, merchant, and category are instantly extracted and auto-filled.
- 🚨 **Smart Budget Alerts:** Set monthly budgets and receive real-time email alerts (via **Resend**) the moment your spending crosses the 80% threshold.
- 📊 **Interactive Analytics:** Visualize your income vs. expenses with interactive, responsive Recharts that look stunning in dark mode.
- 💳 **Multi-Account Management:** Track all your bank accounts, credit cards, and cash in a single, unified command center.
- 🔒 **Enterprise-Grade Security:** Secure, seamless authentication managed by **Clerk**.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** PostgreSQL via [Supabase](https://supabase.com/) Connection Pooler
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/)
- **AI Integration:** [Google Generative AI (Gemini 2.5)](https://ai.google.dev/)
- **Email Delivery:** [Resend](https://resend.com/)
- **Background Jobs:** [Inngest](https://www.inngest.com/)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ManojYadav2005/FinTrack.git
   cd FinTrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design Philosophy
FinTrack rejects the standard, overly-simplified white dashboards. We believe power users want their tools to feel powerful. The UI makes heavy use of:
- `JetBrains Mono` for precise alignment of financial data.
- Color-coded badges and alerts.
- Smooth CSS micro-animations that make the interface feel alive without being distracting.

## 👨‍💻 Author
Engineered with precision by **Manoj Yadav**.

---
*Built to empower smarter money decisions.*
