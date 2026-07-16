"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatCurrency";

const COLORS = ["#3b82f6", "#06b6d4", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#ec4899"];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const d = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      d.getMonth() === currentDate.getMonth() &&
      d.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* ── Recent Transactions (3/5 width) ── */}
      <div className="lg:col-span-3 simple-card overflow-hidden">
        {/* Card header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Recent Transactions</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium">
              {recentTransactions.length}
            </span>
          </div>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[140px] h-8 bg-white border-slate-200 text-slate-700 text-sm focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-700">
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id} className="text-sm">
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 px-5 py-2.5 border-b border-slate-100 bg-slate-50">
          <div className="col-span-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Description</div>
          <div className="col-span-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Date</div>
          <div className="col-span-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Category</div>
          <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">Amount</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {recentTransactions.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-slate-400">No transactions yet</p>
            </div>
          ) : (
            recentTransactions.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-12 gap-2 px-5 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    t.type === "EXPENSE" ? "bg-red-400" : "bg-green-400"
                  )} />
                  <span className="text-sm text-slate-700 truncate">
                    {t.description || "Untitled"}
                  </span>
                </div>
                <div className="col-span-3 text-sm text-slate-400 self-center">
                  {format(new Date(t.date), "dd MMM yy")}
                </div>
                <div className="col-span-3 self-center">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                    {t.category}
                  </span>
                </div>
                <div className={cn(
                  "col-span-2 text-sm font-semibold text-right self-center flex items-center justify-end gap-0.5",
                  t.type === "EXPENSE" ? "text-red-500" : "text-green-600"
                )}>
                  {t.type === "EXPENSE"
                    ? <ArrowDownRight className="w-3.5 h-3.5" />
                    : <ArrowUpRight className="w-3.5 h-3.5" />}
                  {formatCurrency(Number(t.amount))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Expense Breakdown (2/5 width) ── */}
      <div className="lg:col-span-2 simple-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-white">
          <span className="text-sm font-semibold text-slate-700">Expenses by Category</span>
        </div>
        <div className="p-4">
          {pieChartData.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-400">No expenses this month</p>
            </div>
          ) : (
            <>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieChartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`${formatCurrency(Number(v))}`, "Spent"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        color: "#0f172a",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-3 space-y-1.5">
                {pieChartData.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-slate-600 truncate max-w-[100px]">{entry.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{formatCurrency(Number(entry.value))}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
