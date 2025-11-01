import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  TrendingUp,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";

// 🌍 Stats Data — glass-style with subtle gradients
export const statsData = [
  {
    value: "2K+",
    label: "Active Users Empowered",
    subtext: "Growing community of goal-driven users worldwide",
  },
  {
    value: "$1.5B+",
    label: "Money Managed Securely",
    subtext: "Across personal, business, and joint accounts",
  },
  {
    value: "99.98%",
    label: "System Uptime",
    subtext: "Always available, always reliable",
  },
  {
    value: "4.5★",
    label: "User Experience Rating",
    subtext: "Based on thousands of user reviews",
  },
];

// ⚡ Feature Data — fresh layout: vertical cards with icon circles
export const featuresData = [
  
  // {
  //   icon: <Receipt className="h-8 w-8 text-indigo-500" />,
  //   title: "AI Receipt Scanner",
  //   description:
  //     "No typing needed — upload or snap, and we extract merchant names, totals, and dates automatically.",
  //   accent: "from-indigo-500/10 to-cyan-500/10",
  // },

  {
    icon: <PieChart className="h-8 w-8 text-yellow-500" />,
    title: "Smart Category Breakdown",
    description:
      "Auto-categorize your expenses and visualize how your money flows across categories.",
    accent: "from-yellow-500/10 to-amber-500/10",
  },

  {
    icon: <PieChart className="h-8 w-8 text-indigo-500" />,
    title: "Goal-Based Budgeting",
    description:
      "Plan monthly budgets or long-term goals with predictive insights that adapt to your habits.",
    accent: "from-purple-500/10 to-blue-500/10",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-indigo-500" />,
    title: "Unified Accounts View",
    description:
      "Connect multiple bank accounts and cards. Manage everything under one secure dashboard.",
    accent: "from-blue-500/10 to-teal-500/10",
  },
  
  {
    icon: <Shield className="h-8 w-8 text-indigo-500" />,
    title: "Enterprise-Grade Privacy",
    description:
      "Your data is encrypted end-to-end. We don’t sell, share, or compromise your security.",
    accent: "from-indigo-500/10 to-purple-500/10",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
    title: "Expense Growth Tracking",
    description:
      "Understand your month-over-month growth patterns with clean trend visuals and analytics.",
    accent: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-cyan-500" />,
    title: "Income & Expense Comparison",
    description:
      "Compare income sources against expenses to understand your true cash flow health.",
    accent: "from-cyan-500/10 to-teal-500/10",
  },
];

// 🧭 How It Works — timeline style
export const howItWorksData = [
  {
    step: "Step 1",
    title: "Create Your Free Account",
    description:
      "Sign up securely and personalize your dashboard — no credit card required.",
    icon: <CreditCard className="h-7 w-7 text-indigo-600" />,
  },
  {
    step: "Step 2",
    title: "Link & Sync Your Accounts",
    description:
      "Connect your banks and cards securely. Transactions sync automatically in real time.",
    icon: <BarChart3 className="h-7 w-7 text-indigo-600" />,
  },
  {
    step: "Step 3",
    title: "Get Instant Insights",
    description:
      "See smart breakdowns of income, expenses, and budgets — AI-powered and beautifully visualized.",
    icon: <Zap className="h-7 w-7 text-indigo-600" />,
  },
];

// 💬 Testimonials — more realistic, minimal layout with subtle personality
export const testimonialsData = [
  {
    name: "Arjun Mehta",
    role: "Tech Entrepreneur",
    image: "https://randomuser.me/api/portraits/men/43.jpg",
    quote:
      "Welth helped me consolidate my personal and startup finances seamlessly. The insights feel human — not robotic.",
  },
  {
    name: "Lisa Fernandez",
    role: "Digital Nomad",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    quote:
      "Finally, a finance tool that doesn’t overwhelm me. I see where my money goes and where it *should* go next.",
  },
  {
    name: "Rahul Bansal",
    role: "Investment Analyst",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    quote:
      "I track five currencies and several accounts. Welth’s multi-currency dashboard works flawlessly. It’s become my daily go-to.",
  },
];
