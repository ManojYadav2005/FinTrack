// // original code
// "use client";

// import { useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { format } from "date-fns";
// import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

// const COLORS = [
//   "#FF6B6B",
//   "#4ECDC4",
//   "#45B7D1",
//   "#96CEB4",
//   "#FFEEAD",
//   "#D4A5A5",
//   "#9FA8DA",
// ];

// export function DashboardOverview({ accounts, transactions }) {
//   const [selectedAccountId, setSelectedAccountId] = useState(
//     accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
//   );

//   // Filter transactions for selected account
//   const accountTransactions = transactions.filter(
//     (t) => t.accountId === selectedAccountId
//   );

//   // Get recent transactions (last 5)
//   const recentTransactions = accountTransactions
//     .sort((a, b) => new Date(b.date) - new Date(a.date))
//     .slice(0, 5);

//   // Calculate expense breakdown for current month
//   const currentDate = new Date();
//   const currentMonthExpenses = accountTransactions.filter((t) => {
//     const transactionDate = new Date(t.date);
//     return (
//       t.type === "EXPENSE" &&
//       transactionDate.getMonth() === currentDate.getMonth() &&
//       transactionDate.getFullYear() === currentDate.getFullYear()
//     );
//   });

//   // Group expenses by category
//   const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
//     const category = transaction.category;
//     if (!acc[category]) {
//       acc[category] = 0;
//     }
//     acc[category] += transaction.amount;
//     return acc;
//   }, {});

//   // Format data for pie chart
//   const pieChartData = Object.entries(expensesByCategory).map(
//     ([category, amount]) => ({
//       name: category,
//       value: amount,
//     })
//   );

//   return (
//     <div className="grid gap-4 md:grid-cols-2">
//       {/* Recent Transactions Card */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//           <CardTitle className="text-base font-normal">
//             Recent Transactions
//           </CardTitle>
//           <Select
//             value={selectedAccountId}
//             onValueChange={setSelectedAccountId}
//           >
//             <SelectTrigger className="w-[140px]">
//               <SelectValue placeholder="Select account" />
//             </SelectTrigger>
//             <SelectContent>
//               {accounts.map((account) => (
//                 <SelectItem key={account.id} value={account.id}>
//                   {account.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {recentTransactions.length === 0 ? (
//               <p className="text-center text-muted-foreground py-4">
//                 No recent transactions
//               </p>
//             ) : (
//               recentTransactions.map((transaction) => (
//                 <div
//                   key={transaction.id}
//                   className="flex items-center justify-between"
//                 >
//                   <div className="space-y-1">
//                     <p className="text-sm font-medium leading-none">
//                       {transaction.description || "Untitled Transaction"}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       {format(new Date(transaction.date), "PP")}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={cn(
//                         "flex items-center",
//                         transaction.type === "EXPENSE"
//                           ? "text-red-500"
//                           : "text-green-500"
//                       )}
//                     >
//                       {transaction.type === "EXPENSE" ? (
//                         <ArrowDownRight className="mr-1 h-4 w-4" />
//                       ) : (
//                         <ArrowUpRight className="mr-1 h-4 w-4" />
//                       )}
//                       ${transaction.amount.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Expense Breakdown Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-base font-normal">
//             Monthly Expense Breakdown
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-0 pb-5">
//           {pieChartData.length === 0 ? (
//             <p className="text-center text-muted-foreground py-4">
//               No expenses this month
//             </p>
//           ) : (
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                   data={pieChartData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
//                   >
//                   {pieChartData.map((entry, index) => (
//                   <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                   />
//                   ))}
//                   </Pie>
//                   <Tooltip
//                   formatter={(value) => `$${value.toFixed(2)}`}
//                   contentStyle={{
//                   backgroundColor: "hsl(var(--popover))",
//                   border: "1px solid hsl(var(--border))",
//                   borderRadius: "var(--radius)",
//                   }}
//                   />
//                   <Legend />
//                   </PieChart>
//                   </ResponsiveContainer>
//                  </div>
//                  )}
//                  </CardContent>
//                 </Card>
//                 </div>
//   );
// }








"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9FA8DA",
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  // Filter transactions for selected account
  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  // Get recent transactions (last 5)
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Recent Transactions Card */}
      <Card className="relative bg-gradient-to-br from-slate-950 via-emerald-900 to-slate-950
 border border-slate-700/60 rounded-2xl shadow-md hover:shadow-[0_0_25px_-5px_rgba(251,146,60,0.3)] hover:border-orange-400/50 transition-all duration-300 group overflow-hidden">
        {/* Animated Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700"></div>
  
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
          <CardTitle className="text-base font-semibold text-slate-200 tracking-wide group-hover:text-orange-400 transition-colors duration-200">
            Recent Transactions
          </CardTitle>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[150px] bg-slate-900/70 border border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400 rounded-lg shadow-sm hover:border-orange-400/40 transition-all">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border border-slate-700 text-white shadow-lg">
              {accounts.map((account) => (
                <SelectItem
                  key={account.id}
                  value={account.id}
                  className="hover:bg-orange-500/10 cursor-pointer transition-colors"
                >
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
  
        <CardContent className="relative z-10">
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-slate-500 py-4 italic">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 rounded-xl p-3 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-100 leading-none">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex items-center font-semibold tracking-wide text-sm",
                      transaction.type === "EXPENSE"
                        ? "text-red-400"
                        : "text-green-400"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? (
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                    )}
                    ${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
  
      {/* Expense Breakdown Card */}
      <Card className="relative bg-gradient-to-br from-slate-950 via-emerald-900 to-slate-950
 border border-slate-700/60 rounded-2xl shadow-md hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.3)] hover:border-indigo-500/50 transition-all duration-300 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700"></div>
  
        <CardHeader className="relative z-10">
          <CardTitle className="text-base font-semibold text-slate-200 tracking-wide group-hover:text-indigo-400 transition-colors duration-200">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
  
        <CardContent className="p-0 pb-5 relative z-10">
          {pieChartData.length === 0 ? (
            <p className="text-center text-slate-500 py-4 italic">
              No expenses this month
            </p>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
  


}
