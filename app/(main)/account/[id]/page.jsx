import { Suspense } from "react";
import { getAccountWithTransactions } from "@/backend/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";
import { CreditCard } from "lucide-react";
import { formatCurrency } from "@/backend/lib/formatCurrency";

export default async function AccountPage({ params }) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
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
              {account.type.toLowerCase()} account · {account._count.transactions} transactions
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
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[400px] border border-slate-200 rounded-xl bg-white">
            <BarLoader width={200} color="#3b82f6" />
          </div>
        }
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transaction Table */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[400px] border border-slate-200 rounded-xl bg-white">
            <BarLoader width={200} color="#3b82f6" />
          </div>
        }
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}