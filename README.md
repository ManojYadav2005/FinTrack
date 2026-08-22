<p align="center">
  <img src="frontend/public/logo1.png" alt="FinTrack Logo" width="80" />
</p>

<h1 align="center">FinTrack — Personal Finance Platform</h1>

<p align="center">
  A full-stack personal finance dashboard built with the <strong>MERN Stack (Vite + React, Node.js, Express, MongoDB)</strong> and <strong>Clerk</strong>. Track multiple accounts, manage transactions, set monthly budgets, and receive real-time budget alert emails.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-B73BFE?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Express.js-404D59?logo=express" alt="Express.js" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white" alt="Clerk" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

<p align="center">
  <a href="https://github.com/ManojYadav2005/FinTrack" target="_blank"><img src="https://img.shields.io/badge/📂_Source_Code-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub" /></a>
</p>

---

## 📸 Preview

<p align="center">
  <img src="frontend/public/banner.jpeg" alt="FinTrack Dashboard Preview" width="100%" />
</p>

---

## ✨ Features

### 📊 Smart Dashboard
- Real-time overview of **Total Balance**, **Monthly Income**, and **Monthly Expenses**
- Data fetched efficiently using **React Query** and **Axios**
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
- Instantly syncs state with the Express Backend

### 🚨 Real-Time Budget Alerts
- When spending crosses **80%** of monthly budget, an alert email is sent instantly via **Resend**
- Uses a lightweight HTML template generated directly on the Node.js server
- Maximum **one alert per calendar month** — no duplicate emails

### 📈 Interactive Charts
- Per-account **income vs expense bar charts** powered by **Recharts**
- Available on individual account detail pages

### 🔒 Authentication & Route Protection
- Fully managed via **Clerk React** and **Clerk Express**
- JWT Bearer tokens are automatically passed to the backend via Axios interceptors
- Clerk user synced to MongoDB on login

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Vite + React 18 | Client-side UI and routing (`react-router-dom`) |
| **Backend** | Node.js + Express | RESTful API server handling all business logic |
| **Database** | MongoDB Atlas + Mongoose | NoSQL database — 4 models: User, Account, Transaction, Budget |
| **Auth** | Clerk | Authentication, OAuth, JWT validation |
| **Data Fetching**| TanStack Query + Axios | API calls, caching, loading states, token injection |
| **Styling** | Tailwind CSS 3 | Utility-first CSS framework |
| **UI Components** | Radix UI + shadcn/ui | Dialog, Select, Checkbox, Popover, Drawer, Switch, Progress |
| **Email** | Resend | Budget alert emails via transactional email API |
| **Charts** | Recharts | Income vs expense bar charts per account |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vite + React)                   │
│  Pages, UI Components, React Query (Data Fetching), Tailwind   │
│                                                                   │
│  [Axios Interceptor injects Clerk JWT into headers]              │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP GET/POST/PUT/DELETE
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node + Express)                    │
│                                                                   │
│  clerkMiddleware() verifies JWT and extracts userId              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     API ROUTES                            │   │
│  │  /api/dashboard → dashboardController                    │   │
│  │  /api/accounts  → accountController                      │   │
│  │  /api/transactions → transactionController               │   │
│  │  /api/budgets   → budgetController                       │   │
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
│   Sends budget alert HTML email to user                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
FinTrackNew/
├── backend/                      # Node.js + Express Backend
│   ├── index.js                  # Entry point, Express setup, middlewares
│   ├── routes/                   # Express routes (auth, accounts, budgets, etc.)
│   ├── controllers/              # Business logic for API endpoints
│   ├── models/                   # Mongoose schemas
│   ├── lib/                      # Utilities (mongoose.js, send-email.js)
│   ├── emails/                   # HTML Email templates
│   └── package.json
│
├── frontend/                     # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx               # React Router & Auth Wrapper
│   │   ├── main.jsx              # Providers (Clerk, React Query)
│   │   ├── pages/                # Route-level components (Dashboard, Account, etc.)
│   │   ├── components/           # Shared UI (Header, Hero, shadcn ui components)
│   │   ├── lib/                  # Axios setup (api.js), formatCurrency, utils
│   │   └── data/                 # Static content
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── package.json                  # Root: runs both servers via 'concurrently'
└── ARCHITECTURE.md               # Detailed architecture guide
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

# Install all dependencies (Frontend + Backend)
npm run install:all
```

### Environment Variables

Create a `.env` file in the **root** directory:

```env
# Clerk Authentication (VITE_ for frontend, CLERK_ for backend)
VITE_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_AFTER_SIGN_IN_URL=/dashboard
VITE_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database (MongoDB)
DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/fintrack

# Email (Resend) — for budget alert emails
RESEND_API_KEY=re_...
```

### Run Development Server

To start both the Express backend and Vite frontend simultaneously:

```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 👨‍💻 Author

Built with ❤️ by **[Manoj Yadav](https://github.com/ManojYadav2005)**

---

<p align="center"><em>Built to empower smarter money decisions. 💰</em></p>
