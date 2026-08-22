import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAccountWithTransactions } from "@/lib/api";
import { BarLoader, ClipLoader } from "react-spinners";
import { CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

// Lazy import the heavy sub-components
import { AccountChart } from "./account/account-chart";
import { TransactionTable } from "./account/transaction-table";

export default function AccountPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: accountData, isLoading, error } = useQuery({
    queryKey: ["account", id],
    queryFn: () => getAccountWithTransactions(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#2563eb" size={40} />
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 text-lg">Account not found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 underline text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">
              {account.name}
            </h1>
            <p className="text-sm text-slate-500 capitalize">
              {account.type?.toLowerCase()} account · {account._count?.transactions || 0} transactions
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-3xl font-bold text-slate-800">
            {formatCurrency(parseFloat(account.balance))}
          </div>
          <p className="text-sm text-slate-400 mt-0.5">Current Balance</p>
        </div>
      </div>

      {/* Analytics Chart */}
      <AccountChart transactions={transactions} />

      {/* Transaction Table */}
      <TransactionTable transactions={transactions} accountId={id} />
    </div>
  );
}
