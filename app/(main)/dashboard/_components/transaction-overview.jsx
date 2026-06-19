"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const COLORS = ["#3b82f6","#06b6d4","#22c55e","#f59e0b","#8b5cf6","#ef4444","#ec4899"];

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
      <div className="lg:col-span-3 terminal-card overflow-hidden">
        {/* Table header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">TABLE:</span>
            <span className="text-xs font-mono text-cyan-400">recent_transactions</span>
            <span className="sql-badge sql-badge-blue">{recentTransactions.length} rows</span>
          </div>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[130px] h-7 bg-slate-800 border-slate-700 text-slate-300 text-xs font-mono focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="account" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id} className="text-xs font-mono hover:bg-slate-800">
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 px-5 py-2.5 border-b border-slate-800 bg-slate-900/20">
          <div className="col-span-4 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">description</div>
          <div className="col-span-3 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">date</div>
          <div className="col-span-3 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">category</div>
          <div className="col-span-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest text-right">amount</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-800">
          {recentTransactions.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm font-mono text-slate-600">-- no rows returned --</p>
            </div>
          ) : (
            recentTransactions.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-12 gap-2 px-5 py-3 hover:bg-slate-800/50 transition-colors group"
              >
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    t.type === "EXPENSE" ? "bg-red-400" : "bg-green-400"
                  )} />
                  <span className="text-xs text-slate-300 truncate group-hover:text-slate-100 transition-colors">
                    {t.description || "Untitled"}
                  </span>
                </div>
                <div className="col-span-3 text-xs font-mono text-slate-500 self-center">
                  {format(new Date(t.date), "dd MMM yy")}
                </div>
                <div className="col-span-3 self-center">
                  <span className="sql-badge sql-badge-blue text-[10px]">{t.category}</span>
                </div>
                <div className={cn(
                  "col-span-2 text-xs font-mono font-semibold text-right self-center flex items-center justify-end gap-0.5",
                  t.type === "EXPENSE" ? "text-red-400" : "text-green-400"
                )}>
                  {t.type === "EXPENSE"
                    ? <ArrowDownRight className="w-3 h-3" />
                    : <ArrowUpRight className="w-3 h-3" />}
                  {Number(t.amount).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Expense Breakdown (2/5 width) ── */}
      <div className="lg:col-span-2 terminal-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">VIEW:</span>
            <span className="text-xs font-mono text-purple-400">expense_by_category</span>
          </div>
        </div>
        <div className="p-4">
          {pieChartData.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-mono text-slate-600">-- no expenses this month --</p>
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
                      formatter={(v) => [`$${Number(v).toFixed(2)}`, "Spent"]}
                      contentStyle={{
                        backgroundColor: "#0d1323",
                        border: "1px solid #263045",
                        borderRadius: "8px",
                        color: "#e2e8f0",
                        fontSize: "12px",
                        fontFamily: "JetBrains Mono, monospace",
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
                      <div className="w-2 h-2 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs font-mono text-slate-400 truncate max-w-[100px]">{entry.name}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-300">${Number(entry.value).toFixed(2)}</span>
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
