<p align="center">
  <img src="public/logo1.png" alt="FinTrack Logo" width="80" />
</p>

<h1 align="center">FinTrack — Personal Finance Platform</h1>

<p align="center">
  A full-stack personal finance dashboard built with <strong>Next.js 16</strong>, <strong>MongoDB</strong>, and <strong>Clerk</strong>. Track multiple accounts, manage transactions, set monthly budgets, and receive real-time budget alert emails.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white" alt="Clerk" />
  <img src="https://img.shields.io/badge/Resend-Email-000000?logoColor=white" alt="Resend" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
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
- Data fetched server-side using **Next.js Server Components** — zero client-side fetch calls on initial load
- Budget progress bar with automatic 80% threshold detection

### 💳 Multi-Account Management
- Create and manage multiple accounts (**Savings** / **Current**)
- Set a **default account** — all budget calculations are tied to it
- Real-time balance updates on every transaction via **MongoDB sessions** (ACID guaranteed)

### 📝 Full Transaction CRUD
- Add, edit, and delete transactions with **category tagging**, **description**, and **date picker**
- All balance mutations are wrapped in **Mongoose sessions** — if any step fails, the whole operation rolls back
- **Bulk delete** — select and remove multiple transactions at once with automatic balance reversal
- Mark transactions as **recurring** (Daily / Weekly / Monthly / Yearly) — stored in DB with `nextRecurringDate`

### 💰 Monthly Budget
- Set a monthly budget directly from the dashboard
- Real-time progress bar shows current month's spending vs budget
- Updates instantly using **Server Actions** + `revalidatePath`

### 🚨 Real-Time Budget Alerts
- When spending crosses **80%** of monthly budget, an alert email is sent instantly via **Resend**
- Alert fires on the same request as transaction creation — no delay
- Uses **React Email** template for a clean, formatted email
- Maximum **one alert per calendar month** — no duplicate emails

### 📈 Interactive Charts
- Per-account **income vs expense bar charts** powered by **Recharts**
- Available on individual account detail pages

### 🔒 Authentication & Route Protection
- Fully managed via **Clerk** — supports Google OAuth, email/password
- `middleware.js` automatically redirects unauthenticated users away from `/dashboard`, `/account`, `/transaction`
- Clerk user synced to MongoDB via `lib/checkUser.js`

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Server Components, Server Actions, file-based routing |
| **Language** | JavaScript (ES2024) | Full-stack — same language frontend and backend |
| **Styling** | Tailwind CSS 3 | Utility-first CSS framework |
| **Database** | MongoDB Atlas + Mongoose | NoSQL database — 4 models: User, Account, Transaction, Budget |
| **Auth** | Clerk | Authentication, OAuth, session, middleware route guard |
| **Email** | Resend + React Email | Budget alert emails via transactional email API |
| **Charts** | Recharts | Income vs expense bar charts per account |
| **UI Components** | Radix UI + shadcn/ui | Dialog, Select, Checkbox, Popover, Drawer, Switch, Progress |
| **Icons** | Lucide React | Icon set used across all pages |
| **Notifications** | Sonner | Toast notifications on form submissions |
| **Date Utility** | date-fns | Date formatting and calculations |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Frontend)                        │
│  Next.js 16 — React 19 — Tailwind CSS — Radix UI — Recharts    │
│                                                                   │
│  Server Components (data fetch)  +  Client Components (UI/UX)   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP Request (page visit)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                              │
│                                                                   │
│  middleware.js  →  Clerk Auth Guard  →  Route Allow / Block     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                SERVER ACTIONS (/actions)                  │   │
│  │  dashboard.js   → getUserAccounts, createAccount         │   │
│  │  account.js     → getAccount, bulkDelete, setDefault     │   │
│  │  transaction.js → create, update, get, list              │   │
│  │  budget.js      → getCurrentBudget, updateBudget         │   │
│  │  budget-alert.js→ sendBudgetAlertEmail (80% trigger)     │   │
│  │  send-email.js  → Resend wrapper                         │   │
│  └──────────────────────────────┬───────────────────────────┘   │
└─────────────────────────────────┼───────────────────────────────┘
                                  │ Mongoose queries
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB ATLAS (Database)                       │
│                                                                   │
│   User  |  Account  |  Transaction  |  Budget                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ (on budget alert)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESEND (Email Service)                         │
│   Sends budget alert email via React Email template              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
FinTrackNew/
├── app/
│   ├── (auth)/                   # Clerk sign-in / sign-up pages
│   ├── (main)/
│   │   ├── dashboard/            # Main dashboard page (Server Component)
│   │   ├── account/[id]/         # Per-account: balance, chart, transactions
│   │   └── transaction/          # Add / Edit transaction form
│   ├── api/
│   │   └── seed/                 # Dev-only DB seeder
│   ├── layout.js                 # Root layout (Clerk provider + theme)
│   └── page.js                   # Landing / Hero page
│
├── actions/                      # Next.js Server Actions ("use server")
│   ├── dashboard.js              # getUserAccounts, createAccount, getDashboardData
│   ├── account.js                # getAccountWithTransactions, bulkDeleteTransactions, updateDefaultAccount
│   ├── transaction.js            # createTransaction, updateTransaction, getTransaction, getUserTransactions
│   ├── budget.js                 # getCurrentBudget, updateBudget
│   ├── budget-alert.js           # sendBudgetAlertEmail — fires on 80% spend
│   ├── send-email.js             # Resend wrapper
│   └── seed.js                   # Dev-only fake data generator
│
├── models/                       # Mongoose schemas (MongoDB)
│   ├── User.js                   # name, email, clerkUserId, imageUrl
│   ├── Account.js                # name, type, balance, isDefault, userId
│   ├── Transaction.js            # type, amount, category, isRecurring, nextRecurringDate, userId
│   └── Budget.js                 # amount, lastAlertSent, userId
│
├── lib/
│   ├── mongoose.js               # Cached MongoDB connection (no hot-reload leaks)
│   ├── checkUser.js              # Clerk ↔ MongoDB user sync on every protected page
│   ├── utils.js                  # cn() helper (clsx + tailwind-merge)
│   └── formatCurrency.js         # Indian Rupee (INR) formatter
│
├── emails/
│   └── template.jsx              # React Email template (budget-alert)
│
├── components/
│   ├── header.jsx                # Navigation header with Clerk UserButton
│   ├── hero.jsx                  # Landing page hero section
│   ├── create-account-drawer.jsx # Drawer for new account creation
│   └── ui/                       # Shared UI primitives (Radix / shadcn)
│
├── hooks/
│   └── use-fetch.js              # Custom hook: wraps Server Actions with loading/error state
│
├── data/
│   ├── landing.js                # Static content for landing page
│   └── categories.js             # Transaction category list
│
└── middleware.js                  # Clerk auth middleware — protects /dashboard, /account, /transaction
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB Atlas** cluster ([Create free](https://www.mongodb.com/atlas))
- **Clerk** application ([Sign up](https://clerk.com/))
- **Resend** account ([Sign up](https://resend.com/))

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
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=sign-up

# Database (MongoDB)
DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/fintrack

# Email (Resend) — for budget alert emails
RESEND_API_KEY=re_...
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Preview Email Templates

```bash
npm run email
```

---

## 🧠 Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Server Actions over API Routes** | No boilerplate — direct server mutations from client, `revalidatePath` auto-refreshes UI |
| **MongoDB Sessions for mutations** | ACID guarantee — if balance update fails mid-way, transaction creation rolls back. Used in `createTransaction` and `bulkDeleteTransactions` |
| **Clerk over NextAuth** | Zero-config OAuth, built-in sign-in UI, easy Clerk ↔ MongoDB user sync |
| **Resend + React Email** | Transactional budget alert emails with component-based React templates |
| **Server Components for data fetch** | Dashboard data fetched on server — no loading spinners, no client fetch, instant page render |

---

## 👨‍💻 Author

Built with ❤️ by **[Manoj Yadav](https://github.com/ManojYadav2005)**

---

<p align="center"><em>Built to empower smarter money decisions. 💰</em></p>
