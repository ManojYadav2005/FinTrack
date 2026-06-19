import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";
import { Database, CreditCard } from "lucide-react";

export default async function AccountPage({ params }) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-mono tracking-tight text-slate-100 capitalize">
              {account.name}
            </h1>
            <p className="text-sm font-mono text-slate-500">
              SCHEMA: {account.type.toLowerCase()}_account
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-3xl font-bold font-mono text-slate-100">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm font-mono text-slate-500">
            {account._count.transactions} rows returned
          </p>
        </div>
      </div>

      {/* Analytics Chart */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[400px] border border-slate-800 rounded-xl bg-slate-900/40">
            <BarLoader width={200} color="#3b82f6" />
          </div>
        }
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transaction Table */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[400px] border border-slate-800 rounded-xl bg-slate-900/40">
            <BarLoader width={200} color="#3b82f6" />
          </div>
        }
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}