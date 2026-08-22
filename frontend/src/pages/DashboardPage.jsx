import React, { useEffect, useState } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserAccounts, getDashboardData, getCurrentBudget } from "@/lib/api";
import { formatCurrency } from "@/lib/formatCurrency";
import { AccountCard } from "./dashboard/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./dashboard/budget-progress";
import { DashboardOverview } from "./dashboard/transaction-overview";
import { ClipLoader } from "react-spinners";

export default function DashboardPage() {
  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: getUserAccounts,
  });

  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  });

  const defaultAccount = accounts.find((a) => a.isDefault);

  const { data: budgetData } = useQuery({
    queryKey: ["budget", defaultAccount?.id],
    queryFn: () => getCurrentBudget(defaultAccount?.id),
    enabled: !!defaultAccount,
  });

  const totalBalance = accounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);
  const thisMonth = new Date();
  const monthTxs = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === thisMonth.getMonth() && d.getFullYear() === thisMonth.getFullYear();
  });
  const monthIncome = monthTxs.filter((t) => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
  const monthExpense = monthTxs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);

  const isLoading = accountsLoading || txLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#2563eb" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 space-y-6">

        {/* Page header */}
        <div className="pb-2 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {accounts.length} accounts · {transactions.length} transactions
          </p>
        </div>

        {/* Quick stat row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="simple-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Balance</p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </div>
          <div className="simple-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Month Income</p>
              <p className="text-2xl font-bold text-green-600 mt-0.5">
                +{formatCurrency(monthIncome)}
              </p>
            </div>
          </div>
          <div className="simple-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Month Expenses</p>
              <p className="text-2xl font-bold text-red-500 mt-0.5">
                -{formatCurrency(monthExpense)}
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
          transactions={transactions}
        />

        {/* Accounts Grid */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-base font-semibold text-slate-700">Your Accounts</h2>
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">{accounts.length} total</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CreateAccountDrawer onSuccess={() => {}}>
              <button className="simple-card p-6 flex flex-col items-center justify-center cursor-pointer border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all min-h-[160px] group w-full">
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-all">
                  <Plus className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="text-sm text-slate-500 group-hover:text-blue-600 font-medium transition-colors">Add Account</p>
              </button>
            </CreateAccountDrawer>
            {accounts.length > 0 &&
              accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
