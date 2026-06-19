"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
      if (transaction.type === "INCOME") acc[date].income += transaction.amount;
      else acc[date].expense += transaction.amount;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  const net = totals.income - totals.expense;

  return (
    <div className="terminal-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">VIEW:</span>
          <span className="text-xs font-mono text-cyan-400">transaction_overview</span>
        </div>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full sm:w-[160px] h-8 bg-slate-800 border-slate-700 text-slate-300 text-xs font-mono focus:ring-1 focus:ring-blue-500 transition-colors">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key} className="text-xs font-mono hover:bg-slate-800">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="p-5">
        {/* Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Total Income</p>
            <p className="text-2xl font-bold font-mono text-green-400">${totals.income.toFixed(2)}</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Total Expenses</p>
            <p className="text-2xl font-bold font-mono text-red-400">${totals.expense.toFixed(2)}</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Net Balance</p>
            <p className={`text-2xl font-bold font-mono ${net >= 0 ? "text-green-400" : "text-red-400"}`}>
              ${net.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis 
                dataKey="date" 
                fontSize={12} 
                fontFamily="monospace"
                tickLine={false} 
                axisLine={{ stroke: "#334155" }} 
                tick={{ fill: "#64748b" }}
                dy={10}
              />
              <YAxis
                fontSize={12}
                fontFamily="monospace"
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: "#64748b" }}
                dx={-10}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, undefined]}
                contentStyle={{
                  backgroundColor: "#0d1323",
                  border: "1px solid #263045",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                  fontSize: "12px",
                  fontFamily: "JetBrains Mono, monospace",
                }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                wrapperStyle={{ fontSize: "12px", fontFamily: "monospace", color: "#94a3b8" }}
              />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
