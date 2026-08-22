import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserAccounts } from "@/lib/api";
import { AddTransactionForm } from "./transaction/transaction-form";
import { defaultCategories } from "@/data/categories";
import { ClipLoader } from "react-spinners";

export default function TransactionPage() {
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: getUserAccounts,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#2563eb" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="pb-4 border-b border-slate-200 mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Add Transaction</h1>
          <p className="text-sm text-slate-500 mt-0.5">Record a new income or expense</p>
        </div>
        <AddTransactionForm accounts={accounts} categories={defaultCategories} />
      </div>
    </div>
  );
}
