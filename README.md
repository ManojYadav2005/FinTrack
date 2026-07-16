<p align="center">
  <img src="public/logo1.png" alt="FinTrack Logo" width="80" />
</p>

<h1 align="center">FinTrack — AI-Powered Personal Finance Platform</h1>

<p align="center">
  A full-stack, production-grade personal finance dashboard built with <strong>Next.js 16</strong>, <strong>MongoDB</strong>, and <strong>Inngest</strong>. Track accounts, automate recurring transactions, get AI-generated spending insights, and receive real-time budget alerts — all from one dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white" alt="Clerk" />
  <img src="https://img.shields.io/badge/Inngest-Background%20Jobs-5865F2?logo=data:image/svg+xml;base64,&logoColor=white" alt="Inngest" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Resend-Email-000000?logo=resend&logoColor=white" alt="Resend" />
</p>

<p align="center">
  <a href="https://fin-track-bzpr.vercel.app" target="_blank"><img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_App-blue?style=for-the-badge" alt="Live Demo" /></a>
  &nbsp;
  <a href="https://github.com/ManojYadav2005/FinTrack" target="_blank"><img src="https://img.shields.io/badge/📂_Source_Code-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub" /></a>
</p>

---

## 📸 Preview

<p align="center">
  <img src="public/banner.jpeg" alt="FinTrack Dashboard Preview" width="100%" />
</p>

---

## ✨ Features

### 📊 Smart Dashboard
- Real-time overview of **Total Balance**, **Monthly Income**, and **Monthly Expenses**
- Data computed server-side using **Next.js Server Components** — zero client-side API calls for initial load
- Budget progress bar with automatic threshold detection

### 💳 Multi-Account Management
- Create and manage multiple accounts (**Savings** / **Current**)
- Set a **default account** — all dashboard calculations are tied to it
- Real-time balance updates on every transaction (atomic operations via **MongoDB sessions**)

### 📝 Full Transaction CRUD
- Add, edit, and delete transactions with **category tagging**, **descriptions**, and **date picker**
- All balance mutations are wrapped in **Mongoose sessions** to ensure **ACID** data consistency
- **Bulk delete** — select and remove multiple transactions at once with proper balance reversal

### 🔁 Automated Recurring Transactions
- Mark any transaction as recurring: **Daily** / **Weekly** / **Monthly** / **Yearly**
- `nextRecurringDate` is auto-calculated based on the selected interval
- Processed automatically via **Inngest cron jobs** running daily at midnight
- Includes **throttling** (10 txns/min per user) and **retry with exponential backoff** to handle failures gracefully

### 🚨 Smart Budget Alerts
- Set a monthly budget from the dashboard
- When spending crosses **80%**, a real-time email alert is dispatched instantly via **Resend**
- Budget alerts are fired **synchronously** on transaction creation for immediate feedback
- Inngest also runs a **background check every 6 hours** as a safety net

### 📧 AI-Powered Monthly Financial Reports
- On the **1st of every month**, Inngest triggers automated report generation
- Each user receives an email with: **income summary**, **expense breakdown by category**, and **3 AI-generated spending insights**
- Insights are generated using **Google Gemini AI** — personalized, actionable advice based on actual spending data
- Emails are beautifully rendered using **React Email** (`@react-email/components`)

### 📈 Interactive Charts
- Per-account **income vs expense bar charts** powered by **Recharts**
- Rendered on individual account pages for granular financial analysis

### 🔒 Authentication & Security
- Fully managed via **Clerk** — supports Google OAuth, email/password, and more
- **Middleware-protected routes** — unauthenticated users are redirected automatically
- User data is synced between Clerk and MongoDB via a custom `checkUser` utility

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  Next.js 16 (App Router + React 19 + Turbopack)            │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐ │
│  │Dashboard │  │ Accounts │  │Transaction│  │  Budget   │ │
│  │  Page    │  │  Page    │  │   Form    │  │ Progress  │ │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └─────┬─────┘ │
│       │              │              │              │       │
│       ▼              ▼              ▼              ▼       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Next.js Server Actions Layer              │   │
│  │  dashboard.js │ account.js │ transaction.js │ budget │   │
│  └───────────────────────┬─────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
     ┌──────────────┐ ┌────────┐ ┌──────────┐
     │  MongoDB     │ │ Clerk  │ │  Resend  │
     │  Atlas       │ │  Auth  │ │  Email   │
     │  (Mongoose)  │ │        │ │          │
     └──────┬───────┘ └────────┘ └──────────┘
            │
            ▼
  ┌──────────────────────────────────────────┐
  │         INNGEST (Background Jobs)        │
  │                                          │
  │  ⏰ Daily     → Process recurring txns   │
  │  ⏰ Monthly   → Generate AI reports      │
  │  ⏰ Every 6h  → Check budget alerts      │
  │                                          │
  │  Features: Retry, Throttling, Batching   │
  └──────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why This Choice |
|-------|-----------|-----------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Server Components, Server Actions, Turbopack for fast DX |
| **Language** | JavaScript (ES2024) | Full-stack JS — no context switching |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first, rapid prototyping |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) + [Mongoose](https://mongoosejs.com/) | Flexible schemas, Atlas for managed hosting |
| **Auth** | [Clerk](https://clerk.com/) | Drop-in auth with OAuth, webhooks, and user management |
| **Background Jobs** | [Inngest](https://www.inngest.com/) | Serverless-friendly cron + event queue with built-in retry/throttling |
| **AI** | [Google Gemini](https://ai.google.dev/) | Generates personalized financial insights for monthly reports |
| **Email** | [Resend](https://resend.com/) + [React Email](https://react.email/) | Transactional emails with beautiful React-rendered templates |
| **Charts** | [Recharts](https://recharts.org/) | Composable, responsive SVG charts for React |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) | Accessible, unstyled primitives with custom theming |

---

## 🗂️ Project Structure

```
fintrack/
├── app/
│   ├── (auth)/                  # Clerk sign-in / sign-up pages
│   ├── (main)/
│   │   ├── dashboard/           # Main dashboard: accounts, budget, overview
│   │   ├── account/[id]/        # Per-account: balance, chart, transaction table
│   │   └── transaction/         # Add / Edit transaction form
│   ├── api/
│   │   ├── inngest/             # Inngest webhook handler (serves background functions)
│   │   ├── scan-receipt/        # (Preserved) Gemini receipt scan endpoint
│   │   └── seed/                # DB seed route for development
│   ├── layout.js                # Root layout with Clerk provider & theme
│   └── page.js                  # Landing / Hero page
│
├── actions/                     # Next.js Server Actions
│   ├── dashboard.js             # getUserAccounts, createAccount, getDashboardData
│   ├── account.js               # getAccountWithTransactions, bulkDeleteTransactions
│   ├── transaction.js           # createTransaction, updateTransaction, getTransaction
│   ├── budget.js                # getCurrentBudget, updateBudget
│   ├── budget-alert.js          # sendBudgetAlertEmail (synchronous, on-demand)
│   └── send-email.js            # Resend wrapper for all transactional emails
│
├── models/                      # Mongoose schemas (MongoDB)
│   ├── User.js                  # name, email, clerkUserId, imageUrl
│   ├── Account.js               # name, type, balance, isDefault, userId
│   ├── Transaction.js           # type, amount, category, isRecurring, nextRecurringDate
│   └── Budget.js                # amount, lastAlertSent, userId
│
├── lib/
│   ├── mongoose.js              # Cached MongoDB connection (prevents hot-reload leaks)
│   ├── checkUser.js             # Clerk ↔ MongoDB user sync utility
│   └── inngest/
│       ├── client.js            # Inngest client initialization
│       └── function.js          # All background job definitions (4 functions)
│
├── emails/
│   └── template.jsx             # React Email templates (budget-alert, monthly-report)
│
├── components/
│   ├── header.jsx               # Navigation header with Clerk user button
│   ├── hero.jsx                 # Landing page hero section
│   ├── create-account-drawer.jsx # Slide-up drawer for new account creation
│   └── ui/                      # Shared UI primitives (shadcn/ui + Radix)
│
├── hooks/                       # Custom React hooks
├── data/                        # Static data (landing page content)
└── middleware.js                 # Clerk auth middleware (route protection)
```

---

## ⚙️ Background Jobs (Inngest)

Inngest acts as the **background job orchestrator** — handling scheduled tasks that run independently of user requests.

| Function | Trigger | What It Does |
|----------|---------|-------------|
| `triggerRecurringTransactions` | `cron: 0 0 * * *` (Daily midnight) | Finds all due recurring transactions and dispatches processing events |
| `processRecurringTransaction` | Event: `transaction.recurring.process` | Creates the new transaction, updates account balance, calculates next due date |
| `generateMonthlyReports` | `cron: 0 0 1 * *` (1st of month) | Generates per-user financial reports with Gemini AI insights, sends via email |
| `checkBudgetAlerts` | `cron: 0 */6 * * *` (Every 6 hours) | Checks spending vs budget, sends alert email if ≥ 80% used |

**Why Inngest over alternatives?**
- ✅ **Serverless-compatible** — works natively with Next.js, no separate server needed
- ✅ **Built-in retry** with exponential backoff — handles transient failures automatically
- ✅ **Per-user throttling** — prevents overwhelming the system with bulk operations
- ✅ **Event batching** — efficiently processes large numbers of recurring transactions
- ✅ **Observability** — built-in dashboard for monitoring job execution

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB Atlas** cluster ([Create free](https://www.mongodb.com/atlas))
- **Clerk** application ([Sign up](https://clerk.com/))
- **Resend** account ([Sign up](https://resend.com/))
- **Inngest** account ([Sign up](https://www.inngest.com/)) — for background jobs
- **Gemini API Key** ([Get key](https://ai.google.dev/)) — for AI-powered insights

### Installation

```bash
# Clone the repository
git clone https://github.com/ManojYadav2005/FinTrack.git
cd FinTrack

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/fintrack

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Inngest (Background Jobs)
INNGEST_API_KEY=...
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Resend (Email)
RESEND_API_KEY=re_...

# Google Gemini AI (Financial Insights)
GEMINI_API_KEY=...
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Preview React Email Templates

```bash
npm run email
```

---

## 🧠 Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Server Actions over API Routes** | Reduces boilerplate, provides type-safe server mutations, and works seamlessly with React 19's `useActionState` |
| **MongoDB Sessions for Transactions** | Ensures atomicity — if a transaction creation fails mid-way, the account balance is never left in an inconsistent state |
| **Inngest over node-cron** | Serverless-compatible, built-in retry/throttling, and doesn't require a persistent server process |
| **Clerk over NextAuth** | Zero-config OAuth, built-in UI components, webhook support for user sync, and better DX |
| **React Email for templates** | Component-based email design with TypeScript support, preview server, and consistent rendering across email clients |
| **Mongoose over Prisma (Migration)** | Flexible schema design for MongoDB, better aggregation pipeline support, and native MongoDB session handling |

---

## 📋 API Endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| `GET/POST/PUT` | `/api/inngest` | Inngest webhook handler — serves all background functions |
| `POST` | `/api/scan-receipt` | *(Preserved, UI hidden)* — Gemini-powered receipt scanner |
| `GET` | `/api/seed` | Development-only database seeder |

> 💡 Most data mutations happen through **Server Actions** (`/actions/*`), not API routes — following Next.js 16 best practices.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 👨‍💻 Author

Built with ❤️ by **[Manoj Yadav](https://github.com/ManojYadav2005)**

---

<p align="center"><em>Built to empower smarter money decisions. 💰</em></p>
