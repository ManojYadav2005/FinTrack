import { Suspense } from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";
import { Plus, Database, TrendingUp, TrendingDown, Wallet } from "lucide-react";

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  // Quick stats
  const totalBalance = accounts?.reduce((sum, a) => sum + parseFloat(a.balance), 0) || 0;
  const thisMonth = new Date();
  const monthTxs = (transactions || []).filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === thisMonth.getMonth() && d.getFullYear() === thisMonth.getFullYear();
  });
  const monthIncome = monthTxs.filter((t) => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
  const monthExpense = monthTxs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-root)" }}>
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Page header */}
        <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
              DATABASE: <span className="text-blue-400">fintrack</span>
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              <span className="text-green-400">●</span> {accounts?.length || 0} accounts · {(transactions || []).length} transactions loaded
            </p>
          </div>
        </div>

        {/* Quick stat row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="terminal-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Total Balance</p>
              <p className="text-2xl font-bold font-mono text-slate-100 mt-0.5">
                ${totalBalance.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="terminal-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Month Income</p>
              <p className="text-2xl font-bold font-mono text-green-400 mt-0.5">
                +${monthIncome.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="terminal-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Month Expense</p>
              <p className="text-2xl font-bold font-mono text-red-400 mt-0.5">
                -${monthExpense.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />

        {/* Dashboard Overview */}
        <DashboardOverview
          accounts={accounts}
          transactions={transactions || []}
        />

        {/* Accounts Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              TABLE: accounts
            </span>
            <div className="flex-1 h-px bg-slate-800" />
            <span className="sql-badge sql-badge-blue">{accounts?.length || 0} rows</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CreateAccountDrawer>
              <div className="terminal-card p-6 flex flex-col items-center justify-center cursor-pointer border-dashed hover:border-blue-500/60 hover:bg-blue-500/5 transition-all min-h-[160px] group">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 group-hover:border-blue-500/40 flex items-center justify-center mb-3 transition-all">
                  <Plus className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-sm font-mono text-slate-500 group-hover:text-slate-300 transition-colors">INSERT account</p>
              </div>
            </CreateAccountDrawer>
            {accounts?.length > 0 &&
              accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
