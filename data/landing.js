import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  TrendingUp,
  Zap,
  Shield,
  Sparkles,
  ScanLine,
} from "lucide-react";

// Stats
export const statsData = [
  {
    value: "2K+",
    label: "Active Users Empowered",
  },
  {
    value: "$1.5B+",
    label: "Money Managed Securely",
  },
  {
    value: "99.98%",
    label: "System Uptime",
  },
  {
    value: "4.5★",
    label: "User Rating",
  },
];

// Features — SQL table rows
export const featuresData = [
  // NOTE: AI Receipt Scanner feature hidden — uncomment to restore:
  // {
  //   icon: <ScanLine className="h-5 w-5 text-blue-400" />,
  //   title: "AI Receipt Scanner",
  //   description:
  //     "Snap or upload a receipt — Gemini Vision auto-extracts amount, date, merchant and category. Zero manual typing.",
  // },
  {
    icon: <Receipt className="h-5 w-5 text-blue-400" />,
    title: "Quick Transaction Logging",
    description:
      "Log income and expenses in seconds with smart category tagging, recurring schedules, and instant balance updates.",
  },
  {
    icon: <PieChart className="h-5 w-5 text-yellow-400" />,
    title: "Smart Category Breakdown",
    description:
      "Auto-categorize expenses and visualize money flow across all categories with interactive charts.",
  },
  {
    icon: <Zap className="h-5 w-5 text-purple-400" />,
    title: "Goal-Based Budgeting",
    description:
      "Set monthly budgets with 80% threshold alerts sent directly to your email before you overspend.",
  },
  {
    icon: <CreditCard className="h-5 w-5 text-cyan-400" />,
    title: "Unified Accounts View",
    description:
      "Connect multiple bank accounts and cards. Manage everything under one secure dashboard.",
  },
  {
    icon: <Shield className="h-5 w-5 text-green-400" />,
    title: "Enterprise-Grade Privacy",
    description:
      "Your data is encrypted end-to-end. We don't sell, share, or compromise your security — ever.",
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-blue-400" />,
    title: "Expense Growth Tracking",
    description:
      "Understand your month-over-month growth patterns with clean trend visuals and analytics.",
  },
];

// How it works
export const howItWorksData = [
  {
    step: "STEP_01",
    title: "Create Your Account",
    description:
      "Sign up securely in seconds. No credit card required. Your dashboard is ready instantly.",
    icon: <CreditCard className="h-6 w-6 text-blue-400" />,
  },
  {
    step: "STEP_02",
    title: "Add Transactions",
    description:
      "Log your income and expenses with smart categories, dates, and recurring schedules — all in a few clicks.",
    icon: <Receipt className="h-6 w-6 text-blue-400" />,
  },
  {
    step: "STEP_03",
    title: "Get Smart Insights",
    description:
      "See instant breakdowns, budget alerts at 80%, and AI-powered insights in your email.",
    icon: <Zap className="h-6 w-6 text-blue-400" />,
  },
];

// Testimonials
export const testimonialsData = [
  {
    name: "Arjun Mehta",
    role: "tech_entrepreneur",
    image: "https://randomuser.me/api/portraits/men/43.jpg",
    quote:
      "FinTrack helped me consolidate my personal and startup finances seamlessly. The recurring transaction feature saves me 30 minutes a day.",
  },
  {
    name: "Lisa Fernandez",
    role: "digital_nomad",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    quote:
      "Finally, a finance tool that doesn't overwhelm me. The 80% budget alert caught me before I overspent — twice!",
  },
  {
    name: "Rahul Bansal",
    role: "investment_analyst",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    quote:
      "I track five accounts and love the SQL-style dashboard. The data clarity is unmatched — it's become my daily go-to.",
  },
];
