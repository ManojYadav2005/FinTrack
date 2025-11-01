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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg border-0 rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-6 px-6 bg-purple-200/50 rounded-t-2xl">
        <CardTitle className="text-lg font-semibold text-purple-800">
          Transaction Overview
        </CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[150px] bg-white shadow-md border-none rounded-lg">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg rounded-lg">
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-6">
        {/* Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-center">
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition-all duration-300">
            <p className="text-sm text-purple-700 font-medium">Total Income</p>
            <p className="text-xl font-bold text-green-600">${totals.income.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition-all duration-300">
            <p className="text-sm text-purple-700 font-medium">Total Expenses</p>
            <p className="text-xl font-bold text-red-600">${totals.expense.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition-all duration-300">
            <p className="text-sm text-purple-700 font-medium">Net</p>
            <p
              className={`text-xl font-bold ${
                totals.income - totals.expense >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${(totals.income - totals.expense).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[350px] bg-white rounded-2xl shadow-inner p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 10, right: 15, left: 15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#ddd" />
              <XAxis dataKey="date" fontSize={13} tickLine={false} axisLine={{ stroke: "#ccc" }} />
              <YAxis
                fontSize={13}
                tickLine={false}
                axisLine={{ stroke: "#ccc" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, undefined]}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="income" name="Income" fill="#16a34a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#dc2626" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// 1 time change
